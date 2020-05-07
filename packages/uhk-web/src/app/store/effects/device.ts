import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
    FirmwareUpgradeIpcResponse,
    HardwareConfiguration,
    IpcResponse,
    NotificationType,
    UserConfiguration,
    UdevRulesInfo
} from 'uhk-common';
import {
    ActionTypes,
    ConnectionStateChangedAction,
    EnableUsbStackTestAction,
    HideSaveToKeyboardButton,
    ReadConfigSizesAction,
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
import { AppState, deviceConnected, getRouterState, getUserConfiguration } from '../index';
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
        .pipe(
            ofType<ConnectionStateChangedAction>(ActionTypes.ConnectionStateChanged),
            withLatestFrom(this.store.select(getRouterState), this.store.select(deviceConnected)),
            tap(([action, route]) => {
                const state = action.payload;

                if (route.state && route.state.url.startsWith('/device/firmware')) {
                    return;
                }

                if (!state.hasPermission || state.udevRulesInfo === UdevRulesInfo.Different) {
                    return this.router.navigate(['/privilege']);
                }

                if (state.bootloaderActive) {
                    return this.router.navigate(['/recovery-device']);
                }

                if (state.connected && state.zeroInterfaceAvailable) {
                    const allowDefaultNavigation = [
                        '/detection',
                        '/privilege',
                        '/loading'
                    ].some(start => route.state.url.startsWith(start));

                    if (allowDefaultNavigation) {
                        return this.router.navigate(['/']);
                    }

                    return;
                }

                return this.router.navigate(['/detection']);
            }),
            distinctUntilChanged((
                [prevAction, prevRoute, prevConnected],
                [currAction, currRoute, currConnected]) => {

                return prevConnected === currConnected &&
                    prevAction.payload.hasPermission === currAction.payload.hasPermission &&
                    prevAction.payload.zeroInterfaceAvailable === currAction.payload.zeroInterfaceAvailable &&
                    prevAction.payload.udevRulesInfo === currAction.payload.udevRulesInfo;
            }),
            mergeMap(([action, route, connected]) => {
                const payload = action.payload;

                if (connected
                    && payload.hasPermission
                    && payload.zeroInterfaceAvailable
                    && payload.udevRulesInfo === UdevRulesInfo.Ok) {
                    return [
                        new ReadConfigSizesAction(),
                        new LoadConfigFromDeviceAction()
                    ];
                }

                return EMPTY;
            })
        );

    @Effect({ dispatch: false })
    setPrivilegeOnLinux$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.SetPrivilegeOnLinux),
            tap(() => {
                this.deviceRendererService.setPrivilegeOnLinux();
            })
        );

    @Effect()
    setPrivilegeOnLinuxReply$: Observable<Action> = this.actions$
        .pipe(
            ofType<SetPrivilegeOnLinuxReplyAction>(ActionTypes.SetPrivilegeOnLinuxReply),
            map(action => action.payload),
            switchMap((response: any) => {
                if (response.success) {
                    this.appRendererService.getAppStartInfo();
                    return EMPTY;
                }

                return of(new SetupPermissionErrorAction(response.error));
            })
        );

    @Effect({ dispatch: false })
    saveConfiguration$: Observable<Action> = this.actions$
        .pipe(
            ofType<SaveConfigurationAction>(ActionTypes.SaveConfiguration),
            withLatestFrom(this.store),
            tap(([action, state]) => {
                setTimeout(() => this.sendUserConfigToKeyboard(
                    state.userConfiguration.userConfiguration,
                    state.app.hardwareConfig,
                    action.payload),
                100);
            }),
            switchMap(() => EMPTY)
        );

    @Effect()
    saveConfigurationReply$: Observable<Action> = this.actions$
        .pipe(
            ofType<SaveConfigurationReplyAction>(ActionTypes.SaveConfigurationReply),
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
        .pipe(
            ofType(ActionTypes.SaveToKeyboardSuccess),
            withLatestFrom(this.store),
            switchMap(([action, state]) => timer(1000)
                .pipe(
                    mergeMap(() => {
                        const actions = [new HideSaveToKeyboardButton()];

                        if (state.device.restoreUserConfiguration) {
                            actions.push(new RestoreUserConfigurationFromBackupSuccessAction());
                            this.router.navigate(['/']);
                        }

                        return actions;
                    })
                )
            )
        );

    @Effect()
    resetMouseSpeedSettings$: Observable<Action> = this.actions$
        .pipe(
            ofType(
                ActionTypes.ResetPcMouseSpeedSettings,
                ActionTypes.ResetMacMouseSpeedSettings
            ),
            withLatestFrom(this.store.select(getUserConfiguration)),
            map(([action, config]) => new LoadResetUserConfigurationAction(config))
        );

    @Effect() resetUserConfiguration$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.ResetUserConfiguration),
            switchMap(() => {
                const config = this.defaultUserConfigurationService.getDefault();
                return of(new LoadResetUserConfigurationAction(config));
            })
        );

    @Effect() saveResetUserConfigurationToDevice$ = this.actions$
        .pipe(
            ofType<LoadResetUserConfigurationAction>(UserConfigActions.LoadResetUserConfiguration),
            map(action => action.payload),
            switchMap((config: UserConfiguration) => {
                this.dataStorageRepository.saveConfig(config);

                return of(new SaveConfigurationAction(true));
            })
        );

    @Effect() applyUserConfigurationFromFileAction$ = this.actions$
        .pipe(
            ofType<ApplyUserConfigurationFromFileAction>(UserConfigActions.ApplyUserConfigurationFromFile),
            map(action => action.payload),
            switchMap(payload => {
                this.dataStorageRepository.saveConfig(payload.userConfig);

                return of(new SaveConfigurationAction(payload.saveInHistory));
            })
        );

    @Effect({ dispatch: false }) updateFirmware$ = this.actions$
        .pipe(
            ofType<UpdateFirmwareAction>(ActionTypes.UpdateFirmware),
            tap(() => this.deviceRendererService.updateFirmware({
                versionInformation: getVersions()
            }))
        );

    @Effect({ dispatch: false }) updateFirmwareWith$ = this.actions$
        .pipe(
            ofType<UpdateFirmwareWithAction>(ActionTypes.UpdateFirmwareWith),
            map(action => action.payload),
            tap(uploadFile => this.deviceRendererService.updateFirmware({
                versionInformation: getVersions(),
                uploadFile
            }))
        );

    @Effect() updateFirmwareReply$ = this.actions$
        .pipe(
            ofType<UpdateFirmwareReplyAction>(ActionTypes.UpdateFirmwareReply),
            map(action => action.payload),
            switchMap((response: FirmwareUpgradeIpcResponse)
                : Observable<UpdateFirmwareSuccessAction | UpdateFirmwareFailedAction> => {

                if (response.success) {
                    return of(new UpdateFirmwareSuccessAction(response.modules));
                }

                return of(new UpdateFirmwareFailedAction({
                    error: response.error,
                    modules: response.modules
                }));
            })
        );

    @Effect() restoreUserConfiguration$ = this.actions$
        .pipe(
            ofType<ResetUserConfigurationAction>(ActionTypes.RestoreConfigurationFromBackup),
            map(() => new SaveConfigurationAction(true))
        );

    @Effect({ dispatch: false }) recoveryDevice$ = this.actions$
        .pipe(
            ofType<RecoveryDeviceAction>(ActionTypes.RecoveryDevice),
            tap(() => this.deviceRendererService.recoveryDevice())
        );

    @Effect({ dispatch: false }) enableUsbStackTest$ = this.actions$
        .pipe(
            ofType<EnableUsbStackTestAction>(ActionTypes.EnableUsbStackTest),
            tap(() => this.deviceRendererService.enableUsbStackTest())
        );

    @Effect({ dispatch: false }) startConnectionPoller$ = this.actions$
        .pipe(
            ofType(ActionTypes.StartConnectionPoller),
            tap(() => this.deviceRendererService.startConnectionPoller())
        );

    @Effect({ dispatch: false }) readConfigSizes$ = this.actions$
        .pipe(
            ofType(ActionTypes.ReadConfigSizes),
            tap(() => this.deviceRendererService.readConfigSizes())
        );

    constructor(private actions$: Actions,
                private router: Router,
                private appRendererService: AppRendererService,
                private deviceRendererService: DeviceRendererService,
                private store: Store<AppState>,
                private dataStorageRepository: DataStorageRepositoryService,
                private defaultUserConfigurationService: DefaultUserConfigurationService) {
    }

    private sendUserConfigToKeyboard(
        userConfiguration: UserConfiguration,
        hardwareConfig: HardwareConfiguration,
        saveInHistory: boolean): void {
        this.deviceRendererService.saveUserConfiguration({
            saveInHistory,
            uniqueId: hardwareConfig && hardwareConfig.uniqueId,
            configuration: userConfiguration.toJsonObject()
        });
    }
}
