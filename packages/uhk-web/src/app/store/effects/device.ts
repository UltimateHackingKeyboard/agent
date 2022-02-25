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
    UserConfiguration
} from 'uhk-common';
import {
    ActionTypes,
    ConnectionStateChangedAction,
    EnableUsbStackTestAction,
    HideSaveToKeyboardButton,
    ReadConfigSizesAction,
    RecoveryDeviceAction,
    RecoveryDeviceReplyAction,
    RecoveryModuleAction,
    ResetUserConfigurationAction,
    RestoreUserConfigurationFromBackupSuccessAction,
    SaveConfigurationAction,
    SaveConfigurationReplyAction,
    SaveToKeyboardSuccessAction,
    SaveToKeyboardSuccessFailed,
    SetPrivilegeOnLinuxReplyAction,
    StartConnectionPollerAction,
    UpdateFirmwareAction,
    UpdateFirmwareFailedAction,
    UpdateFirmwareReplyAction,
    UpdateFirmwareSuccessAction,
    UpdateFirmwareWithAction
} from '../actions/device';
import { AppRendererService } from '../../services/app-renderer.service';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { SetupPermissionErrorAction, ShowNotificationAction } from '../actions/app';
import { AppState, deviceConnected, disableUpdateAgentPage, getRouterState, getUserConfiguration } from '../index';
import {
    ActionTypes as UserConfigActions,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceAction,
    LoadResetUserConfigurationAction
} from '../actions/user-config';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { getVersions, isVersionGtMinor } from '../../util';

@Injectable()
export class DeviceEffects {
    @Effect() deviceConnectionStateChange$: Observable<Action> = this.actions$
        .pipe(
            ofType<ConnectionStateChangedAction>(ActionTypes.ConnectionStateChanged),
            withLatestFrom(
                this.store.select(getRouterState),
                this.store.select(deviceConnected),
                this.store.select(disableUpdateAgentPage),
            ),
            tap(([action, route, connected, isDisableUpdateAgentPage]) => {
                const state = action.payload;

                if (route.state && route.state.url.startsWith('/device/firmware')) {
                    return;
                }

                if (state.multiDevice) {
                    return this.router.navigate(['/multi-device']);
                }

                if (!state.hasPermission) {
                    return this.router.navigate(['/privilege']);
                }

                if (state.bootloaderActive) {
                    return this.router.navigate(['/recovery-device']);
                }

                if (!isDisableUpdateAgentPage && isVersionGtMinor(state.hardwareModules.rightModuleInfo.userConfigVersion, getVersions().userConfigVersion)) {
                    return this.router.navigate(['/update-agent']);
                }

                if (state.connectedDevice && state.zeroInterfaceAvailable) {
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
                    prevAction.payload.zeroInterfaceAvailable === currAction.payload.zeroInterfaceAvailable;
            }),
            mergeMap(([action, route, connected]) => {
                const payload = action.payload;

                if (connected
                    && payload.hasPermission
                    && payload.zeroInterfaceAvailable) {

                    return [
                        new ReadConfigSizesAction(),
                        new LoadConfigFromDeviceAction()
                    ];
                }

                return EMPTY;
            })
        );

    @Effect({ dispatch: false }) setPrivilegeOnLinux$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.SetPrivilegeOnLinux),
            tap(() => {
                this.deviceRendererService.setPrivilegeOnLinux();
            })
        );

    @Effect() setPrivilegeOnLinuxReply$: Observable<Action> = this.actions$
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

    @Effect({ dispatch: false }) saveConfiguration$: Observable<Action> = this.actions$
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

    @Effect() saveConfigurationReply$: Observable<Action> = this.actions$
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

    @Effect() autoHideSaveToKeyboardButton$: Observable<Action> = this.actions$
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

    @Effect() resetMouseSpeedSettings$: Observable<Action> = this.actions$
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
                const config = this.defaultUserConfigurationService.getDefault().clone();
                config.keymaps = config.keymaps.filter(keymap => keymap.abbreviation !== 'EMP');
                return of(new LoadResetUserConfigurationAction(config));
            })
        );

    @Effect() saveResetUserConfigurationToDevice$ = this.actions$
        .pipe(
            ofType<LoadResetUserConfigurationAction>(UserConfigActions.LoadResetUserConfiguration),
            map(action => action.payload),
            switchMap((config: UserConfiguration) => this.dataStorageRepository.saveConfig(config)
                .pipe(
                    map(() => new SaveConfigurationAction(true))
                )
            )
        );

    @Effect() applyUserConfigurationFromFileAction$ = this.actions$
        .pipe(
            ofType<ApplyUserConfigurationFromFileAction>(UserConfigActions.ApplyUserConfigurationFromFile),
            map(action => action.payload),
            switchMap(payload => this.dataStorageRepository.saveConfig(payload.userConfig)
                .pipe(
                    map(() => new SaveConfigurationAction(payload.saveInHistory))
                )
            )
        );

    @Effect({ dispatch: false }) updateFirmware$ = this.actions$
        .pipe(
            ofType<UpdateFirmwareAction>(ActionTypes.UpdateFirmware),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfig]) => this.deviceRendererService.updateFirmware({
                userConfig: userConfig.toJsonObject(),
                forceUpgrade: action.payload,
                versionInformation: getVersions()
            }))
        );

    @Effect({ dispatch: false }) updateFirmwareWith$ = this.actions$
        .pipe(
            ofType<UpdateFirmwareWithAction>(ActionTypes.UpdateFirmwareWith),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfig]) => this.deviceRendererService.updateFirmware({
                userConfig: userConfig.toJsonObject(),
                forceUpgrade: action.payload.forceUpgrade,
                versionInformation: getVersions(),
                uploadFile: action.payload.uploadFileData
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
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([, userConfig]) => this.deviceRendererService.recoveryDevice(userConfig))
        );

    @Effect() recoveryDeviceReply$ = this.actions$
        .pipe(
            ofType<RecoveryDeviceReplyAction>(ActionTypes.RecoveryDeviceReply),
            map(action => action.payload),
            mergeMap((response: FirmwareUpgradeIpcResponse) => {

                if (response.success) {
                    return [
                        new UpdateFirmwareSuccessAction(response.modules),
                        new StartConnectionPollerAction()
                    ];
                }

                return [
                    new UpdateFirmwareFailedAction({
                        error: response.error,
                        modules: response.modules
                    })
                ];
            })
        );

    @Effect({ dispatch: false }) recoveryModule$ = this.actions$
        .pipe(
            ofType<RecoveryModuleAction>(ActionTypes.RecoveryModule),
            map(action => action.payload),
            tap(moduleId => this.deviceRendererService.recoveryModule(moduleId))
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
