import { Injectable, NgZone } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { devices, HID } from 'node-hid';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';

import { AppState } from '../index';
import { ActionTypes, DeviceAttachedAction, DeviceDetachedAction, InitDeviceAction } from '../actions/device.action';
import { UhkHidApiService } from '../../services/uhk-hid-api.service';
import { Constants } from '../../shared/util/constants';

@Injectable()
export class DeviceEffect {

    @Effect() initDevice$: Observable<Action> = this.actions$
        .ofType(ActionTypes.INIT_DEVICE, ActionTypes.DEVICE_DETACHED)
        .startWith(new InitDeviceAction())
        .switchMap(() => Observable.interval(1000)
            .map(() => {
                    console.log('interval');
                    try {
                        const devs = devices();
                        for (const dev of devs) {
                            // TODO: Hack until not publish new node-hid types
                            const a: any = dev;
                            if (a.vendorId === Constants.VENDOR_ID &&
                                a.productId === Constants.PRODUCT_ID &&
                                a.usagePage === 128 &&
                                a.usage === 129) {
                                const hidDevice = new HID(dev.path);
                                // Hack if not listening on data listener, not throw error when device detached
                                hidDevice.on('data', (data: any) => this.onData(data));
                                hidDevice.on('error', (error: any) => this.onError(error));
                                return new DeviceAttachedAction(hidDevice);
                            }
                        }
                    }
                    catch (err) {
                    }
                    return null;
                }
            )
            .filter(x => x !== null)
            .take(1)
        );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private zone: NgZone,
                private uhk: UhkHidApiService) {
    }

    private onData(data: any) {
    }

    private onError(error: any) {
        console.log('hid Error: ', error);
        this.zone.run(() => this.store.dispatch(new DeviceDetachedAction()));
    }
}
