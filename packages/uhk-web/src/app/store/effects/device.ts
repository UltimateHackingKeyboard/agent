import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

import { NotificationType, IpcResponse } from 'uhk-common';
import {
    ActionTypes,
    ConnectionStateChangedAction, HideSaveToKeyboardButton,
    PermissionStateChangedAction,
    SaveToKeyboardSuccessAction,
    SaveToKeyboardSuccessFailed
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { ShowNotificationAction } from '../actions/app';
import { AppState } from '../index';
import { UserConfiguration } from '../../config-serializer/config-items/user-configuration';
import { UhkBuffer } from '../../config-serializer/uhk-buffer';

@Injectable()
export class DeviceEffects {
    @Effect({dispatch: false})
    deviceConnectionStateChange$: Observable<Action> = this.actions$
        .ofType(ActionTypes.CONNECTION_STATE_CHANGED)
        .map(toPayload)
        .do((connected: boolean) => {
            if (connected) {
                this.router.navigate(['/']);
            }
            else {
                this.router.navigate(['/detection']);
            }
        });

    @Effect({dispatch: false})
    permissionStateChange$: Observable<Action> = this.actions$
        .ofType(ActionTypes.PERMISSION_STATE_CHANGED)
        .map(toPayload)
        .do((hasPermission: boolean) => {
            if (hasPermission) {
                this.router.navigate(['/detection']);
            }
            else {
                this.router.navigate(['/privilege']);
            }
        });

    @Effect({dispatch: false})
    setPrivilegeOnLinux$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SET_PRIVILEGE_ON_LINUX)
        .do(() => {
            this.deviceRendererService.setPrivilegeOnLinux();
        });

    @Effect()
    setPrivilegeOnLinuxReply$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SET_PRIVILEGE_ON_LINUX_REPLY)
        .map(toPayload)
        .mergeMap((response: any) => {
            if (response.success) {
                return [
                    new ConnectionStateChangedAction(true),
                    new PermissionStateChangedAction(true)
                ];
            }
            return [
                <any>new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: response.error.message
                })
            ];
        });

    @Effect({dispatch: false})
    saveConfiguration$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SAVE_CONFIGURATION)
        .withLatestFrom(this.store)
        .map(([action, state]) => state.userConfiguration)
        .do((userConfiguration: UserConfiguration) => {
            const uhkBuffer = new UhkBuffer();
            userConfiguration.toBinary(uhkBuffer);
            setTimeout(() => {
                this.deviceRendererService.saveUserConfiguration(uhkBuffer.getBufferContent());
            });
        })
        .switchMap(() => Observable.empty());

    @Effect()
    saveConfigurationReply$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SAVE_CONFIGURATION_REPLY)
        .map(toPayload)
        .mergeMap((response: IpcResponse) => {
            if (response.success) {
                return [
                    new SaveToKeyboardSuccessAction()
                ];
            }

            return [
                new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: response.error.message
                }),
                new SaveToKeyboardSuccessFailed()
            ];
        });

    @Effect()
    autoHideSaveToKeyboardButton$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SAVE_TO_KEYBOARD_SUCCESS)
        .switchMap(() => Observable.timer(1000)
            .switchMap(() => Observable.of(new HideSaveToKeyboardButton()))
        );

    constructor(private actions$: Actions,
                private router: Router,
                private deviceRendererService: DeviceRendererService,
                private store: Store<AppState>) {
    }

}
