import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMap';

import { DeviceConnectionState, IpcResponse, NotificationType, UhkBuffer, UserConfiguration } from 'uhk-common';
import {
    ActionTypes,
    ConnectionStateChangedAction,
    HideSaveToKeyboardButton,
    SaveConfigurationAction,
    SaveConfigurationReplyAction,
    SaveToKeyboardSuccessAction,
    SaveToKeyboardSuccessFailed,
    SetPrivilegeOnLinuxReplyAction,
    UpdateFirmwareAction,
    UpdateFirmwareFailedAction,
    UpdateFirmwareOkButtonAction,
    UpdateFirmwareReplyAction,
    UpdateFirmwareSuccessAction,
    UpdateFirmwareWithAction
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { SetupPermissionErrorAction, ShowNotificationAction } from '../actions/app';
import { AppState } from '../index';
import {
    ActionTypes as UserConfigActions,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceAction,
    LoadResetUserConfigurationAction
} from '../actions/user-config';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';

@Injectable()
export class DeviceEffects {
    @Effect()
    deviceConnectionStateChange$: Observable<Action> = this.actions$
        .ofType<ConnectionStateChangedAction>(ActionTypes.CONNECTION_STATE_CHANGED)
        .map(action => action.payload)
        .do((state: DeviceConnectionState) => {
            if (!state.hasPermission) {
                this.router.navigate(['/privilege']);
            }
            else if (state.connected) {
                this.router.navigate(['/']);
            }
            else {
                this.router.navigate(['/detection']);
            }
        })
        .switchMap((state: DeviceConnectionState) => {
            if (state.connected && state.hasPermission) {
                return Observable.of(new LoadConfigFromDeviceAction());
            }

            return Observable.empty();
        });

    @Effect({dispatch: false})
    setPrivilegeOnLinux$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SET_PRIVILEGE_ON_LINUX)
        .do(() => {
            this.deviceRendererService.setPrivilegeOnLinux();
        });

    @Effect()
    setPrivilegeOnLinuxReply$: Observable<Action> = this.actions$
        .ofType<SetPrivilegeOnLinuxReplyAction>(ActionTypes.SET_PRIVILEGE_ON_LINUX_REPLY)
        .map(action => action.payload)
        .mergeMap((response: any): any => {
            if (response.success) {
                return [
                    new ConnectionStateChangedAction({
                        connected: true,
                        hasPermission: true
                    })
                ];
            }
            return [
                new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: response.error.message || response.error
                }),
                new SetupPermissionErrorAction(response.error)
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
        .ofType<SaveConfigurationReplyAction>(ActionTypes.SAVE_CONFIGURATION_REPLY)
        .map(action => action.payload)
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

    @Effect()
    resetMouseSpeedSettings$: Observable<Action> = this.actions$
        .ofType(ActionTypes.RESET_MOUSE_SPEED_SETTINGS)
        .switchMap(() => {
            const config = this.defaultUserConfigurationService.getDefault();
            const mouseSpeedDefaultSettings = {};
            const mouseSpeedProps = [
                'mouseMoveInitialSpeed',
                'mouseMoveAcceleration',
                'mouseMoveDeceleratedSpeed',
                'mouseMoveBaseSpeed',
                'mouseMoveAcceleratedSpeed',
                'mouseScrollInitialSpeed',
                'mouseScrollAcceleration',
                'mouseScrollDeceleratedSpeed',
                'mouseScrollBaseSpeed',
                'mouseScrollAcceleratedSpeed'
            ];
            mouseSpeedProps.forEach(prop => {
                mouseSpeedDefaultSettings[prop] = config[prop];
            });
            return Observable.of(new LoadResetUserConfigurationAction(<UserConfiguration>mouseSpeedDefaultSettings));
        });

    @Effect() resetUserConfiguration$: Observable<Action> = this.actions$
        .ofType(ActionTypes.RESET_USER_CONFIGURATION)
        .switchMap(() => {
            const config = this.defaultUserConfigurationService.getDefault();
            return Observable.of(new LoadResetUserConfigurationAction(config));
        });

    @Effect() saveResetUserConfigurationToDevice$ = this.actions$
        .ofType<ApplyUserConfigurationFromFileAction
            | LoadResetUserConfigurationAction>(
            UserConfigActions.LOAD_RESET_USER_CONFIGURATION,
            UserConfigActions.APPLY_USER_CONFIGURATION_FROM_FILE)
        .map(action => action.payload)
        .switchMap((config: UserConfiguration) => {
            this.dataStorageRepository.saveConfig(config);

            return Observable.of(new SaveConfigurationAction());
        });

    @Effect({dispatch: false}) updateFirmware$ = this.actions$
        .ofType<UpdateFirmwareAction>(ActionTypes.UPDATE_FIRMWARE)
        .do(() => this.deviceRendererService.updateFirmware());

    @Effect({dispatch: false}) updateFirmwareWith$ = this.actions$
        .ofType<UpdateFirmwareWithAction>(ActionTypes.UPDATE_FIRMWARE_WITH)
        .map(action => action.payload)
        .do(data => this.deviceRendererService.updateFirmware(data));

    @Effect() updateFirmwareReply$ = this.actions$
        .ofType<UpdateFirmwareReplyAction>(ActionTypes.UPDATE_FIRMWARE_REPLY)
        .map(action => action.payload)
        .switchMap((response: IpcResponse) => {
            if (response.success) {
                return Observable.of(new UpdateFirmwareSuccessAction());
            }

            return Observable.of(new UpdateFirmwareFailedAction(response.error));
        });

    @Effect({dispatch: false}) updateFirmwareOkButton$ = this.actions$
        .ofType<UpdateFirmwareOkButtonAction>(ActionTypes.UPDATE_FIRMWARE_OK_BUTTON)
        .do(() => this.deviceRendererService.startConnectionPoller());

    constructor(private actions$: Actions,
                private router: Router,
                private deviceRendererService: DeviceRendererService,
                private store: Store<AppState>,
                private dataStorageRepository: DataStorageRepositoryService,
                private defaultUserConfigurationService: DefaultUserConfigurationService) {
    }

    private sendUserConfigToKeyboard(userConfiguration: UserConfiguration): void {
        const uhkBuffer = new UhkBuffer();
        userConfiguration.toBinary(uhkBuffer);
        this.deviceRendererService.saveUserConfiguration(uhkBuffer.getBufferContent());
    }
}
