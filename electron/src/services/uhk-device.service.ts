import { Injectable, OnDestroy, NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observer } from 'rxjs/Observer';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Subject } from 'rxjs/Subject';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/switchMap';

import { Device, Interface, InEndpoint, OutEndpoint, findByIds, on } from 'usb';

import { Layer } from '../shared/config-serializer/config-items/Layer';
import { UhkBuffer } from '../shared/config-serializer/UhkBuffer';

const vendorId = 0x1d50;
const productId = 0x6122;
const MAX_PAYLOAD_SIZE = 64;

enum Command {
    UploadConfig = 8,
    ApplyConfig = 9
}

interface SenderMessage {
    buffer: Buffer;
    observer: Observer<any>;
}

@Injectable()
export class UhkDeviceService implements OnDestroy {

    private device: Device;
    private deviceOpened$: BehaviorSubject<boolean>;
    private connected$: BehaviorSubject<boolean>;
    private initizalized$: BehaviorSubject<boolean>;

    private messageIn$: Observable<Buffer>;
    private messageOut$: Subject<SenderMessage>;

    private outSubscription: Subscription;

    constructor(zone: NgZone) {
        this.messageOut$ = new Subject<SenderMessage>();
        this.initizalized$ = new BehaviorSubject(false);
        this.connected$ = new BehaviorSubject(false);
        this.deviceOpened$ = new BehaviorSubject(false);
        this.outSubscription = Subscription.EMPTY;

        this.initialize();

        // The change detection doesn't work properly if the callbacks are called outside Angular Zone
        on('attach', (device: Device) => zone.run(() => this.onDeviceAttach(device)));
        on('detach', (device: Device) => zone.run(() => this.onDeviceDetach(device)));
    }

    ngOnDestroy() {
        this.disconnect();
        this.initizalized$.unsubscribe();
        this.connected$.unsubscribe();
        this.deviceOpened$.unsubscribe();
    }

    initialize(): void {
        if (this.initizalized$.getValue()) {
            return;
        }
        this.device = findByIds(vendorId, productId);
        this.connected$.next(!!this.device);
        if (!this.device) {
            return;
        }
        try {
            this.device.open();
            this.deviceOpened$.next(true);
        } catch (error) {
            console.log(error);
            return;
        }

        const usbInterface: Interface = this.device.interface(0);
        // https://github.com/tessel/node-usb/issues/147
        // The function 'isKernelDriverActive' is not available on Windows and not even needed.
        if (process.platform !== 'win32' && usbInterface.isKernelDriverActive()) {
            usbInterface.detachKernelDriver();
        }

        // https://github.com/tessel/node-usb/issues/30
        // Mac not allow detach the USB driver from the kernel
        if (process.platform !== 'darwin') {
            usbInterface.claim();
        }

        this.messageIn$ = Observable.create((subscriber: Subscriber<Buffer>) => {
            const inEndPoint: InEndpoint = <InEndpoint>usbInterface.endpoints[0];
            console.log('Try to read');
            inEndPoint.transfer(MAX_PAYLOAD_SIZE, (error: string, receivedBuffer: Buffer) => {
                if (error) {
                    console.error('reading error', error);
                    subscriber.error(error);
                } else {
                    console.log('read data', receivedBuffer);
                    subscriber.next(receivedBuffer);
                    subscriber.complete();
                }
            });
        });

        const outEndPoint: OutEndpoint = <OutEndpoint>usbInterface.endpoints[1];
        const outSending = this.messageOut$.concatMap(senderPackage => {
            return (<Observable<void>>Observable.create((subscriber: Subscriber<void>) => {
                console.log('transfering', senderPackage.buffer);
                outEndPoint.transfer(senderPackage.buffer, error => {
                    if (error) {
                        console.error('transfering errored', error);
                        subscriber.error(error);
                    } else {
                        console.log('transfering finished');
                        subscriber.complete();
                    }
                });
            })).concat(this.messageIn$)
                .do(buffer => senderPackage.observer.next(buffer) && senderPackage.observer.complete())
                .catch((error: string) => {
                    senderPackage.observer.error(error);
                    return Observable.empty<void>();
                });
        }).publish();
        this.outSubscription = outSending.connect();

        this.initizalized$.next(true);
    }

    disconnect() {
        this.outSubscription.unsubscribe();
        this.messageIn$ = undefined;
        this.initizalized$.next(false);
        this.deviceOpened$.next(false);
        this.connected$.next(false);
    }

    isInitialized(): Observable<boolean> {
        return this.initizalized$.asObservable();
    }

    isConnected(): Observable<boolean> {
        return this.connected$.asObservable();
    }

    hasPermissions(): Observable<boolean> {
        return this.isConnected()
            .combineLatest(this.deviceOpened$)
            .map((latest: boolean[]) => {
                const connected = latest[0];
                const opened = latest[1];
                if (!connected) {
                    return false;
                } else if (opened) {
                    return true;
                }
                try {
                    this.device.open();
                } catch (error) {
                    return false;
                }
                this.device.close();
                return true;
            });
    }

    isOpened(): Observable<boolean> {
        return this.deviceOpened$.asObservable();
    }

    sendConfig(configBuffer: Buffer): Observable<Buffer> {
        return Observable.create((subscriber: Subscriber<Buffer>) => {
            console.log('Sending...', configBuffer);
            const fragments: Buffer[] = [];
            const MAX_SENDING_PAYLOAD_SIZE = MAX_PAYLOAD_SIZE - 4;
            for (let offset = 0; offset < configBuffer.length; offset += MAX_SENDING_PAYLOAD_SIZE) {
                const length = offset + MAX_SENDING_PAYLOAD_SIZE < configBuffer.length
                    ? MAX_SENDING_PAYLOAD_SIZE
                    : configBuffer.length - offset;
                const header = new Buffer([Command.UploadConfig, length, offset & 0xFF, offset >> 8]);
                fragments.push(Buffer.concat([header, configBuffer.slice(offset, offset + length)]));
            }

            const buffers: Buffer[] = [];
            const observer: Observer<Buffer> = {
                next: (buffer: Buffer) => buffers.push(buffer),
                error: error => subscriber.error(error),
                complete: () => {
                    if (buffers.length === fragments.length) {
                        subscriber.next(Buffer.concat(buffers));
                        subscriber.complete();
                        console.log('Sending finished');
                    }
                }
            };

            fragments
                .map<SenderMessage>(fragment => ({ buffer: fragment, observer }))
                .forEach(senderPackage => this.messageOut$.next(senderPackage));
        });
    }

    applyConfig(): Observable<Buffer> {
        return Observable.create((subscriber: Subscriber<Buffer>) => {
            console.log('Applying configuration');
            this.messageOut$.next({
                buffer: new Buffer([Command.ApplyConfig]),
                observer: subscriber
            });
        });
    }

    onDeviceAttach(device: Device) {
        if (device.deviceDescriptor.idVendor !== vendorId || device.deviceDescriptor.idProduct !== productId) {
            return;
        }
        // Ugly hack: device is not openable (on Windows) right after the attach
        Observable.timer(100)
            .first()
            .subscribe(() => this.initialize());
    }

    onDeviceDetach(device: Device) {
        if (device.deviceDescriptor.idVendor !== vendorId || device.deviceDescriptor.idProduct !== productId) {
            return;
        }
        this.disconnect();
    }

}
