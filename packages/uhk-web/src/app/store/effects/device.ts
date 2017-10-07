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
import 'rxjs/add/operator/switchMap';

import { NotificationType, IpcResponse, UhkBuffer, UserConfiguration } from 'uhk-common';
import {
    ActionTypes,
    ConnectionStateChangedAction,
    HideSaveToKeyboardButton,
    PermissionStateChangedAction,
    SaveConfigurationAction,
    SaveToKeyboardSuccessAction,
    SaveToKeyboardSuccessFailed
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { ShowNotificationAction } from '../actions/app';
import { AppState } from '../index';
import {
    LoadConfigFromDeviceAction,
    LoadResetUserConfigurationAction,
    ActionTypes as UserConfigActions
} from '../actions/user-config';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';

@Injectable()
export class DeviceEffects {
    @Effect()
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
        })
        .switchMap((connected: boolean) => {
            if (connected) {
                return Observable.of(new LoadConfigFromDeviceAction());
            }

            return Observable.empty();
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
            setTimeout(() => this.sendUserConfigToKeyboard(userConfiguration), 100);
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

    @Effect() resetUserConfiguration$: Observable<Action> = this.actions$
        .ofType(ActionTypes.RESET_USER_CONFIGURATION)
        .switchMap(() => {
            const config = this.defaultUserConfigurationService.getDefault();
            return Observable.of(new LoadResetUserConfigurationAction(config));
        });

    @Effect() saveResetUserConfigurationToDevice$ = this.actions$
        .ofType(UserConfigActions.LOAD_RESET_USER_CONFIGURATION)
        .switchMap(() => Observable.of(new SaveConfigurationAction()));

    constructor(private actions$: Actions,
                private router: Router,
                private deviceRendererService: DeviceRendererService,
                private store: Store<AppState>,
                private defaultUserConfigurationService: DefaultUserConfigurationService) {
    }

    private sendUserConfigToKeyboard(userConfiguration: UserConfiguration): void {
        const uhkBuffer = new UhkBuffer();
        userConfiguration.toBinary(uhkBuffer);
        this.deviceRendererService.saveUserConfiguration(uhkBuffer.getBufferContent());
    }
}
