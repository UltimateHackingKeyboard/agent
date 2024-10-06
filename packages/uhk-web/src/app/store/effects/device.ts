import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { EMPTY, of, timer } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, pairwise, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
    FirmwareUpgradeIpcResponse,
    getHardwareConfigFromDeviceResponse,
    HardwareConfiguration,
    IpcResponse,
    NotificationType,
    shouldUpgradeAgent,
    shouldUpgradeFirmware,
    UdevRulesInfo,
    UserConfiguration
} from 'uhk-common';

import {
    ActionTypes,
    ChangeKeyboardLayoutAction,
    ChangeKeyboardLayoutReplyAction,
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
    SkipFirmwareUpgradeAction,
    StartConnectionPollerAction,
    UpdateFirmwareAction,
    UpdateFirmwareFailedAction,
    UpdateFirmwareNotSupportedAction,
    UpdateFirmwareReplyAction,
    UpdateFirmwareSuccessAction,
    UpdateFirmwareWithAction
} from '../actions/device';
import {
    EmptyAction,
    LoadHardwareConfigurationSuccessAction,
    SetupPermissionErrorAction,
    ShowNotificationAction
} from '../actions/app';
import {
    AppState,
    deviceConnected,
    disableUpdateAgentProtection,
    getHardwareConfiguration,
    getRouterState,
    getShowFirmwareUpgradePanel,
    getUserConfiguration
} from '../index';
import {
    ActionTypes as UserConfigActions,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceAction,
    LoadResetUserConfigurationAction
} from '../actions/user-config';
import { AppRendererService } from '../../services/app-renderer.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { getVersions } from '../../util';

@Injectable()
export class DeviceEffects {
    private shouldUpgradeAgent = false;

    changeKeyboardLayout$ = createEffect(() => this.actions$
        .pipe(
            ofType<ChangeKeyboardLayoutAction>(ActionTypes.ChangeKeyboardLayout),
            withLatestFrom(this.store.select(getHardwareConfiguration)),
            tap(([action, hardwareConfiguration]) => {
                this.deviceRendererService.changeKeyboardLayout(action.layout, hardwareConfiguration);
            })
        ),
    {dispatch:false}
    );

    changeKeyboardLayoutFailed$ = createEffect(() => this.actions$
        .pipe(
            ofType<ChangeKeyboardLayoutReplyAction>(ActionTypes.ChangeKeyboardLayoutReply),
            map(action => {
                if (action.payload.success) {
                    return new LoadHardwareConfigurationSuccessAction(getHardwareConfigFromDeviceResponse(action.payload.hardwareConfig));
                }

                return new ShowNotificationAction({
                    message: action.payload.error?.message,
                    type: NotificationType.Error,
                });
            })
        )
    );

    deviceConnectionStateChange$ = createEffect(() => this.actions$
        .pipe(
            ofType<ConnectionStateChangedAction>(ActionTypes.ConnectionStateChanged),
            withLatestFrom(
                this.store.select(getRouterState),
                this.store.select(deviceConnected),
                this.store.select(disableUpdateAgentProtection),
            ),
            tap(([action, route, connected, disableUpdateAgentProtection]) => {
                const state = action.payload;

                if (route.state && route.state.url.startsWith('/device/firmware')) {
                    return;
                }

                if (state.multiDevice) {
                    return this.router.navigate(['/multi-device']);
                }

                if (!state.hasPermission || state.udevRulesInfo === UdevRulesInfo.Different) {
                    return this.router.navigate(['/privilege']);
                }

                if (state.bootloaderActive) {
                    return this.router.navigate(['/recovery-device']);
                }

                if (shouldUpgradeAgent(state.hardwareModules?.rightModuleInfo?.userConfigVersion, disableUpdateAgentProtection, getVersions()?.userConfigVersion)) {
                    this.shouldUpgradeAgent = true;

                    return this.router.navigate(['/update-agent']);
                }

                if (shouldUpgradeFirmware(state.hardwareModules?.rightModuleInfo?.userConfigVersion, getVersions())) {
                    return this.router.navigate(['/update-firmware']);
                }

                if (state.connectedDevice && state.communicationInterfaceAvailable) {
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
                    prevAction.payload.communicationInterfaceAvailable === currAction.payload.communicationInterfaceAvailable &&
                    prevAction.payload.udevRulesInfo === currAction.payload.udevRulesInfo;
            }),
            mergeMap(([action, route, connected]) => {
                const payload = action.payload;

                if (connected
                    && payload.hasPermission
                    && payload.communicationInterfaceAvailable
                    && (payload.udevRulesInfo === UdevRulesInfo.Ok || payload.udevRulesInfo === UdevRulesInfo.UdevDirNotExists)) {

                    const result: Array<Action> = [
                        new ReadConfigSizesAction(),
                    ];

                    if(!this.shouldUpgradeAgent) {
                        result.push(new LoadConfigFromDeviceAction());
                    }

                    return result;
                }

                return EMPTY;
            })
        )
    );

    setPrivilegeOnLinux$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.SetPrivilegeOnLinux),
            tap(() => {
                this.deviceRendererService.setPrivilegeOnLinux();
            })
        ),
    { dispatch: false }
    );

    setPrivilegeOnLinuxReply$ = createEffect(() => this.actions$
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
        )
    );

    saveConfiguration$ = createEffect(() => this.actions$
        .pipe(
            ofType<SaveConfigurationAction>(ActionTypes.SaveConfiguration),
            withLatestFrom(this.store, this.store.select(getShowFirmwareUpgradePanel)),
            tap(([action, state, shouldUpgradeFirmware]) => {
                if (shouldUpgradeFirmware)
                    return this.router.navigate(['/update-firmware']);

                setTimeout(() => this.sendUserConfigToKeyboard(
                    state.userConfiguration.userConfiguration,
                    state.app.hardwareConfig,
                    action.payload),
                100);
            }),
            switchMap(() => EMPTY)
        ),
    { dispatch: false }
    );

    saveConfigurationReply$ = createEffect(() => this.actions$
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
        )
    );

    autoHideSaveToKeyboardButton$ = createEffect(() => this.actions$
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
        )
    );

    resetMouseSpeedSettings$ = createEffect(() => this.actions$
        .pipe(
            ofType(
                ActionTypes.ResetPcMouseSpeedSettings,
                ActionTypes.ResetMacMouseSpeedSettings
            ),
            withLatestFrom(this.store.select(getUserConfiguration)),
            map(([action, config]) => new LoadResetUserConfigurationAction(config))
        )
    );

    resetUserConfiguration$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.ResetUserConfiguration),
            switchMap(() => {
                const config = this.defaultUserConfigurationService.getDefault().clone();
                config.keymaps = config.keymaps.filter(keymap => keymap.abbreviation !== 'EMP');
                return of(new LoadResetUserConfigurationAction(config));
            })
        )
    );

    saveResetUserConfigurationToDevice$ = createEffect(() => this.actions$
        .pipe(
            ofType<LoadResetUserConfigurationAction>(UserConfigActions.LoadResetUserConfiguration),
            map(action => action.payload),
            switchMap((config: UserConfiguration) => this.dataStorageRepository.saveConfig(config)
                .pipe(
                    map(() => new SaveConfigurationAction(true))
                )
            )
        )
    );

    applyUserConfigurationFromFileAction$ = createEffect(() => this.actions$
        .pipe(
            ofType<ApplyUserConfigurationFromFileAction>(UserConfigActions.ApplyUserConfigurationFromFile),
            map(action => action.payload),
            switchMap(payload => this.dataStorageRepository.saveConfig(payload.userConfig)
                .pipe(
                    map(() => new SaveConfigurationAction(payload.saveInHistory))
                )
            )
        )
    );

    updateFirmware$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateFirmwareAction>(ActionTypes.UpdateFirmware),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfig]) => this.deviceRendererService.updateFirmware({
                userConfig: userConfig.toJsonObject(),
                forceUpgrade: action.payload,
                versionInformation: getVersions()
            }))
        ),
    { dispatch: false }
    );

    updateFirmwareWith$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateFirmwareWithAction>(ActionTypes.UpdateFirmwareWith),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([action, userConfig]) => this.deviceRendererService.updateFirmware({
                userConfig: userConfig.toJsonObject(),
                forceUpgrade: action.payload.forceUpgrade,
                versionInformation: getVersions(),
                uploadFile: action.payload.uploadFileData
            }))
        ),
    { dispatch: false }
    );

    updateFirmwareReply$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateFirmwareReplyAction>(ActionTypes.UpdateFirmwareReply),
            map(action => action.payload),
            switchMap((response: FirmwareUpgradeIpcResponse) => {

                if (response.success) {
                    return of(new UpdateFirmwareSuccessAction({
                        firmwareDowngraded: response.firmwareDowngraded,
                        hardwareModules: response.modules,
                        userConfigSaved: response.userConfigSaved
                    }));
                }

                if (response.failReason) {
                    return of(new UpdateFirmwareNotSupportedAction(response.failReason));
                }

                return of(new UpdateFirmwareFailedAction({
                    error: response.error,
                    modules: response.modules
                }));
            })
        )
    );

    restoreUserConfiguration$ = createEffect(() => this.actions$
        .pipe(
            ofType<ResetUserConfigurationAction>(ActionTypes.RestoreConfigurationFromBackup),
            map(() => new SaveConfigurationAction(true))
        )
    );

    recoveryDevice$ = createEffect(() => this.actions$
        .pipe(
            ofType<RecoveryDeviceAction>(ActionTypes.RecoveryDevice),
            withLatestFrom(this.store.select(getUserConfiguration)),
            tap(([, userConfig]) => this.deviceRendererService.recoveryDevice(userConfig))
        ),
    { dispatch: false }
    );

    recoveryDeviceReply$ = createEffect(() => this.actions$
        .pipe(
            ofType<RecoveryDeviceReplyAction>(ActionTypes.RecoveryDeviceReply),
            map(action => action.payload),
            mergeMap((response: FirmwareUpgradeIpcResponse) => {

                if (response.success) {
                    return [
                        new UpdateFirmwareSuccessAction({
                            firmwareDowngraded: response.firmwareDowngraded,
                            hardwareModules: response.modules,
                            userConfigSaved: response.userConfigSaved
                        }),
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
        )
    );

    recoveryModule$ = createEffect(() => this.actions$
        .pipe(
            ofType<RecoveryModuleAction>(ActionTypes.RecoveryModule),
            map(action => action.payload),
            tap(moduleId => this.deviceRendererService.recoveryModule(moduleId))
        ),
    { dispatch: false }
    );

    enableUsbStackTest$ = createEffect(() => this.actions$
        .pipe(
            ofType<EnableUsbStackTestAction>(ActionTypes.EnableUsbStackTest),
            tap(() => this.deviceRendererService.enableUsbStackTest())
        ),
    { dispatch: false }
    );

    startConnectionPoller$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.StartConnectionPoller),
            tap(() => this.deviceRendererService.startConnectionPoller())
        ),
    { dispatch: false }
    );

    readConfigSizes$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.ReadConfigSizes),
            tap(() => this.deviceRendererService.readConfigSizes())
        ),
    { dispatch: false }
    );

    skipFirmwareUpgrade$ = createEffect(() => this.actions$
        .pipe(
            ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
            map<RouterNavigatedAction, string>(action => action?.payload?.routerState?.url),
            pairwise(),
            map(([prevUrl]) => {
                if (prevUrl?.startsWith('/update-firmware'))
                    return new SkipFirmwareUpgradeAction();

                return new EmptyAction();
            })
        )
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
            deviceId: hardwareConfig && hardwareConfig.deviceId,
            uniqueId: hardwareConfig && hardwareConfig.uniqueId,
            configuration: userConfiguration.toJsonObject()
        });
    }
}
