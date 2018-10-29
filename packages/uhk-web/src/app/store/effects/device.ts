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

import {
    FirmwareUpgradeIpcResponse,
    HardwareConfiguration,
    IpcResponse,
    NotificationType,
    UdevRulesInfo,
    UserConfiguration
} from 'uhk-common';
import {
    ActionTypes,
    ConnectionStateChangedAction,
    EnableUsbStackTestAction,
    HideSaveToKeyboardButton,
    RecoveryDeviceAction,
    ResetUserConfigurationAction,
    RestoreUserConfigurationFromBackupSuccessAction,
    SaveConfigurationAction,
    SaveConfigurationReplyAction,
    SaveToKeyboardSuccessAction,
    SaveToKeyboardSuccessFailed,
    SetPrivilegeOnLinuxReplyAction,
    UpdateFirmwareAction,
    UpdateFirmwareFailedAction,
    UpdateFirmwareReplyAction,
    UpdateFirmwareSuccessAction,
    UpdateFirmwareWithAction
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { SetupPermissionErrorAction, ShowNotificationAction } from '../actions/app';
import { AppState, getRouterState } from '../index';
import {
    ActionTypes as UserConfigActions,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceAction,
    LoadResetUserConfigurationAction
} from '../actions/user-config';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { getVersions } from '../../util';

@Injectable()
export class DeviceEffects {
    @Effect()
    deviceConnectionStateChange$: Observable<Action> = this.actions$
        .ofType<ConnectionStateChangedAction>(ActionTypes.CONNECTION_STATE_CHANGED)
        .withLatestFrom(this.store.select(getRouterState))
        .do(([action, route]) => {
            const state = action.payload;

            if (route.state && route.state.url.startsWith('/device/firmware')) {
                return;
            }

            if (state.bootloaderActive) {
                return this.router.navigate(['/recovery-device']);
            }

            if (state.connected) {
                return this.router.navigate(['/']);
            }

            return this.router.navigate(['/privilege']);
        })
        .switchMap(([action, route]) => {
            const state = action.payload;

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
        .map((response: any): any => {
            if (response.success) {
                return new ConnectionStateChangedAction({
                    connected: true,
                    hasPermission: true,
                    bootloaderActive: false,
                    udevRulesInfo: UdevRulesInfo.Ok
                });
            }

            return new SetupPermissionErrorAction(response.error);
        });

    @Effect({dispatch: false})
    saveConfiguration$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SAVE_CONFIGURATION)
        .withLatestFrom(this.store)
        .do(([action, state]) => {
            setTimeout(() => this.sendUserConfigToKeyboard(state.userConfiguration, state.app.hardwareConfig), 100);
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
        .withLatestFrom(this.store)
        .switchMap(([action, state]) => Observable.timer(1000)
            .mergeMap(() => {
                const actions = [new HideSaveToKeyboardButton()];

                if (state.device.hasBackupUserConfiguration) {
                    actions.push(new RestoreUserConfigurationFromBackupSuccessAction());
                    this.router.navigate(['/']);
                }

                return actions;
            })
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
        .do(() => this.deviceRendererService.updateFirmware({
            versionInformation: getVersions()
        }));

    @Effect({dispatch: false}) updateFirmwareWith$ = this.actions$
        .ofType<UpdateFirmwareWithAction>(ActionTypes.UPDATE_FIRMWARE_WITH)
        .map(action => action.payload)
        .do(data => this.deviceRendererService.updateFirmware({
            versionInformation: getVersions(),
            firmware: data
        }));

    @Effect() updateFirmwareReply$ = this.actions$
        .ofType<UpdateFirmwareReplyAction>(ActionTypes.UPDATE_FIRMWARE_REPLY)
        .map(action => action.payload)
        .switchMap((response: FirmwareUpgradeIpcResponse)
            : Observable<UpdateFirmwareSuccessAction | UpdateFirmwareFailedAction> => {
            if (response.success) {
                return Observable.of(new UpdateFirmwareSuccessAction(response.modules));
            }

            return Observable.of(new UpdateFirmwareFailedAction({
                error: response.error,
                modules: response.modules
            }));
        });

    @Effect() restoreUserConfiguration$ = this.actions$
        .ofType<ResetUserConfigurationAction>(ActionTypes.RESTORE_CONFIGURATION_FROM_BACKUP)
        .map(() => new SaveConfigurationAction());

    @Effect({dispatch: false}) recoveryDevice$ = this.actions$
        .ofType<RecoveryDeviceAction>(ActionTypes.RECOVERY_DEVICE)
        .do(() => this.deviceRendererService.recoveryDevice());

    @Effect({dispatch: false}) enableUsbStackTest$ = this.actions$
        .ofType<EnableUsbStackTestAction>(ActionTypes.ENABLE_USB_STACK_TEST)
        .do(() => this.deviceRendererService.enableUsbStackTest());

    constructor(private actions$: Actions,
                private router: Router,
                private deviceRendererService: DeviceRendererService,
                private store: Store<AppState>,
                private dataStorageRepository: DataStorageRepositoryService,
                private defaultUserConfigurationService: DefaultUserConfigurationService) {
    }

    private sendUserConfigToKeyboard(userConfiguration: UserConfiguration, hardwareConfig: HardwareConfiguration): void {
        this.deviceRendererService.saveUserConfiguration({
            uniqueId: hardwareConfig && hardwareConfig.uniqueId,
            configuration: userConfiguration.toJsonObject()
        });
    }
}
