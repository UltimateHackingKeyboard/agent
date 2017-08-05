import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/do';

import { Device, findByIds, InEndpoint, Interface, on, OutEndpoint } from 'usb';

import { Constants, LogService } from 'uhk-common';
import { UhkDeviceService } from './uhk-device.service';

@Injectable()
export class UhkLibUsbApiService extends UhkDeviceService implements OnDestroy {
    private device: Device;

    static isUhkDevice(device: Device) {
        return device.deviceDescriptor.idVendor === Constants.VENDOR_ID &&
            device.deviceDescriptor.idProduct === Constants.PRODUCT_ID;
    }

    constructor(zone: NgZone, protected logService: LogService) {
        super(logService);

        this.initialize();

        // The change detection doesn't work properly if the callbacks are called outside Angular Zone
        on('attach', (device: Device) => zone.run(() => this.onDeviceAttach(device)));
        on('detach', (device: Device) => zone.run(() => this.onDeviceDetach(device)));
    }

    initialize(): void {
        if (this.initialized$.getValue()) {
            return;
        }
        this.device = findByIds(Constants.VENDOR_ID, Constants.PRODUCT_ID);
        this.connected$.next(!!this.device);
        if (!this.device) {
            return;
        }
        try {
            this.device.open();
            this.deviceOpened$.next(true);
        } catch (error) {
            this.logService.error(error);
            return;
        }

        const usbInterface: Interface = this.device.interface(0);
        // https://github.com/tessel/node-usb/issues/147
        // The function 'isKernelDriverActive' is not available on Windows and not even needed.
        if (usbInterface.isKernelDriverActive()) {
            usbInterface.detachKernelDriver();
        }

        this.messageIn$ = Observable.create((subscriber: Subscriber<Buffer>) => {
            const inEndPoint: InEndpoint = <InEndpoint>usbInterface.endpoints[0];
            this.logService.info('Try to read');
            inEndPoint.transfer(Constants.MAX_PAYLOAD_SIZE, (error: string, receivedBuffer: Buffer) => {
                if (error) {
                    this.logService.error('reading error', error);
                    subscriber.error(error);
                } else {
                    this.logService.info('read data', receivedBuffer);
                    subscriber.next(receivedBuffer);
                    subscriber.complete();
                }
            });
        });

        const outEndPoint: OutEndpoint = <OutEndpoint>usbInterface.endpoints[1];
        const outSending = this.messageOut$.concatMap(senderPackage => {
            return (<Observable<void>>Observable.create((subscriber: Subscriber<void>) => {
                this.logService.info('transfering', senderPackage.buffer);
                outEndPoint.transfer(senderPackage.buffer, error => {
                    if (error) {
                        this.logService.error('transfering errored', error);
                        subscriber.error(error);
                    } else {
                        this.logService.info('transfering finished');
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

        this.initialized$.next(true);
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

    onDeviceAttach(device: Device) {
        if (!UhkLibUsbApiService.isUhkDevice(device)) {
            return;
        }
        // Ugly hack: device is not openable (on Windows) right after the attach
        Observable.timer(100)
            .first()
            .subscribe(() => this.initialize());
    }

    onDeviceDetach(device: Device) {
        if (!UhkLibUsbApiService.isUhkDevice(device)) {
            return;
        }
        this.disconnect();
    }
}
