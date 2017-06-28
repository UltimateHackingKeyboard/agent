import { Injectable, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { Device, devices, HID } from 'node-hid';

import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/do';

import { Constants } from '../shared/util';
import { UhkDeviceService } from './uhk-device.service';

@Injectable()
export class UhkHidApiService extends UhkDeviceService implements OnDestroy {
    private device: HID;

    private pollTimer$: Subscription;

    constructor() {
        super();

        this.pollUhkDevice();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this.pollTimer$.unsubscribe();
    }

    initialize(): void {
        if (this.initialized$.getValue()) {
            return;
        }

        this.device = this.getDevice();
        if (!this.device) {
            return;
        }

        this.deviceOpened$.next(true);

        this.messageIn$ = Observable.create((subscriber: Subscriber<Buffer>) => {
            console.log('Try to read');
            this.device.read((error: any, data: any = []) => {
                if (error) {
                    console.error('reading error', error);
                    subscriber.error(error);
                } else {
                    console.log('read data', data);
                    subscriber.next(data);
                    subscriber.complete();
                }
            });
        });

        const outSending = this.messageOut$.concatMap(senderPackage => {
            return (<Observable<void>>Observable.create((subscriber: Subscriber<void>) => {
                console.log('transfering', senderPackage.buffer);
                const data = Array.prototype.slice.call(senderPackage.buffer, 0);
                try {
                    this.device.write(data);
                    console.log('transfering finished');
                    subscriber.complete();
                }
                catch (error) {
                    console.error('transfering errored', error);
                    subscriber.error(error);
                }
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
                return true;
            });
    }

    /**
     * Return the 0 interface of the keyboard.
     * @returns {HID}
     */
    getDevice(): HID {
        try {
            // TODO: Change any to Device after node-hid type have published
            const dev = devices().find((x: any) =>
                x.vendorId === Constants.VENDOR_ID &&
                x.productId === Constants.PRODUCT_ID &&
                ((x.usagePage === 128 && x.usage === 129) || x.interface === 0));

            return new HID(dev.path);
        }
        catch (err) {
        }

        return null;
    }

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * Every second check the HID device list.
     */
    private pollUhkDevice() {
        this.pollTimer$ = Observable.timer(0, 1000)
            .map(() => {
                return devices().some((dev: Device) => dev.vendorId === Constants.VENDOR_ID &&
                    dev.productId === Constants.PRODUCT_ID);
            })
            .distinctUntilChanged()
            .do((connected: boolean) => {
                this.connected$.next(connected);
                if (connected) {
                    this.initialize();
                } else {
                    this.disconnect();
                }

            })
            .subscribe();
    }
}
