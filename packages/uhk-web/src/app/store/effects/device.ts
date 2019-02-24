import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { empty } from 'rxjs/observable/empty';
import { timer } from 'rxjs/observable/timer';
import { map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
    FirmwareUpgradeIpcResponse,
    HardwareConfiguration,
    IpcResponse,
    NotificationType,
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
import { AppRendererService } from '../../services/app-renderer.service';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { SetupPermissionErrorAction, ShowNotificationAction } from '../actions/app';
import { AppState, deviceConnected, getRouterState } from '../index';
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
        .ofType<ConnectionStateChangedAction>(ActionTypes.ConnectionStateChanged)
        .pipe(
            withLatestFrom(this.store.select(getRouterState), this.store.select(deviceConnected)),
            tap(([action, route]) => {
                const state = action.payload;

                if (route.state && route.state.url.startsWith('/device/firmware')) {
                    return;
                }

                if (!state.hasPermission) {
                    return this.router.navigate(['/privilege']);
                }

                if (state.bootloaderActive) {
                    return this.router.navigate(['/recovery-device']);
                }

                if (state.connected && state.zeroInterfaceAvailable) {
                    return this.router.navigate(['/']);
                }

                return this.router.navigate(['/detection']);
            }),
            switchMap(([action, route, connected]) => {
                const payload = action.payload;

                if (connected && payload.hasPermission && payload.zeroInterfaceAvailable) {
                    return Observable.of(new LoadConfigFromDeviceAction());
                }

                return empty();
            })
        );

    @Effect({ dispatch: false })
    setPrivilegeOnLinux$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SetPrivilegeOnLinux)
        .pipe(
            tap(() => {
                this.deviceRendererService.setPrivilegeOnLinux();
            })
        );

    @Effect()
    setPrivilegeOnLinuxReply$: Observable<Action> = this.actions$
        .ofType<SetPrivilegeOnLinuxReplyAction>(ActionTypes.SetPrivilegeOnLinuxReply)
        .pipe(
            map(action => action.payload),
            switchMap((response: any): any => {
                if (response.success) {
                    this.appRendererService.getAppStartInfo();
                    return empty();
                }

                return of(new SetupPermissionErrorAction(response.error));
            })
        );

    @Effect({ dispatch: false })
    saveConfiguration$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SaveConfiguration)
        .pipe(
            withLatestFrom(this.store),
            tap(([action, state]) => {
                setTimeout(() => this.sendUserConfigToKeyboard(
                    state.userConfiguration.userConfiguration,
                    state.app.hardwareConfig),
                           100);
            }),
            switchMap(() => empty())
        );

    @Effect()
    saveConfigurationReply$: Observable<Action> = this.actions$
        .ofType<SaveConfigurationReplyAction>(ActionTypes.SaveConfigurationReply)
        .pipe(
            map(action => action.payload),
            mergeMap((response: IpcResponse) => {
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
            })
        );

    @Effect()
    autoHideSaveToKeyboardButton$: Observable<Action> = this.actions$
        .ofType(ActionTypes.SaveToKeyboardSuccess)
        .pipe(
            withLatestFrom(this.store),
            switchMap(([action, state]) => timer(1000)
                .mergeMap(() => {
                    const actions = [new HideSaveToKeyboardButton()];

                    if (state.device.hasBackupUserConfiguration) {
                        actions.push(new RestoreUserConfigurationFromBackupSuccessAction());
                        this.router.navigate(['/']);
                    }

                    return actions;
                })
            )
        );

    @Effect()
    resetMouseSpeedSettings$: Observable<Action> = this.actions$
        .ofType(ActionTypes.ResetMouseSpeedSettings)
        .pipe(
            switchMap(() => {
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
                return of(new LoadResetUserConfigurationAction(<UserConfiguration>mouseSpeedDefaultSettings));
            })
        );

    @Effect() resetUserConfiguration$: Observable<Action> = this.actions$
        .ofType(ActionTypes.ResetUserConfiguration)
        .pipe(
            switchMap(() => {
                const config = this.defaultUserConfigurationService.getDefault();
                return of(new LoadResetUserConfigurationAction(config));
            })
        );

    @Effect() saveResetUserConfigurationToDevice$ = this.actions$
        .ofType<ApplyUserConfigurationFromFileAction
            | LoadResetUserConfigurationAction>(
            UserConfigActions.LoadResetUserConfiguration,
            UserConfigActions.ApplyUserConfigurationFromFile)
        .pipe(
            map(action => action.payload),
            switchMap((config: UserConfiguration) => {
                this.dataStorageRepository.saveConfig(config);

                return of(new SaveConfigurationAction());
            })
        );

    @Effect({ dispatch: false }) updateFirmware$ = this.actions$
        .ofType<UpdateFirmwareAction>(ActionTypes.UpdateFirmware)
        .pipe(
            tap(() => this.deviceRendererService.updateFirmware({
                versionInformation: getVersions()
            }))
        );

    @Effect({ dispatch: false }) updateFirmwareWith$ = this.actions$
        .ofType<UpdateFirmwareWithAction>(ActionTypes.UpdateFirmwareWith)
        .pipe(
            map(action => action.payload),
            tap(data => this.deviceRendererService.updateFirmware({
                versionInformation: getVersions(),
                firmware: data
            }))
        );

    @Effect() updateFirmwareReply$ = this.actions$
        .ofType<UpdateFirmwareReplyAction>(ActionTypes.UpdateFirmwareReply)
        .pipe(
            map(action => action.payload),
            switchMap((response: FirmwareUpgradeIpcResponse)
                : Observable<UpdateFirmwareSuccessAction | UpdateFirmwareFailedAction> => {

                if (response.success) {
                    return Observable.of(new UpdateFirmwareSuccessAction(response.modules));
                }

                return of(new UpdateFirmwareFailedAction({
                    error: response.error,
                    modules: response.modules
                }));
            })
        );

    @Effect() restoreUserConfiguration$ = this.actions$
        .ofType<ResetUserConfigurationAction>(ActionTypes.RestoreConfigurationFromBackup)
        .pipe(
            map(() => new SaveConfigurationAction())
        );

    @Effect({ dispatch: false }) recoveryDevice$ = this.actions$
        .ofType<RecoveryDeviceAction>(ActionTypes.RecoveryDevice)
        .pipe(
            tap(() => this.deviceRendererService.recoveryDevice())
        );

    @Effect({ dispatch: false }) enableUsbStackTest$ = this.actions$
        .ofType<EnableUsbStackTestAction>(ActionTypes.EnableUsbStackTest)
        .pipe(
            tap(() => this.deviceRendererService.enableUsbStackTest())
        );

    @Effect({ dispatch: false }) startConnectionPoller$ = this.actions$
        .ofType(ActionTypes.StartConnectionPoller)
        .pipe(
            tap(() => this.deviceRendererService.startConnectionPoller())
        );

    constructor(private actions$: Actions,
                private router: Router,
                private appRendererService: AppRendererService,
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
