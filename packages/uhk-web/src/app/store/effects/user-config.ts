import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap, withLatestFrom, } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { saveAs } from 'file-saver';

import {
    BackupUserConfigurationInfo,
    Buffer,
    DEFAULT_DEVICE_NAME,
    getHardwareConfigFromDeviceResponse,
    getUserConfigFromDeviceResponse,
    ConfigurationReply,
    isUserConfigVersionHigherThanFirmware,
    LogService,
    NotificationType,
    readUserConfigurationVersionFromBinary,
    readUserConfigurationVersionFromJsonObject,
    RightModuleInfo,
    shouldUpgradeAgent,
    UHK_60_DEVICE,
    UhkBuffer,
    UhkDeviceProduct,
    UHK_MODULES,
    UserConfiguration,
    VERSIONS,
} from 'uhk-common';

import { EmptyAction } from '../actions/app';
import {
    ActionTypes,
    ApplyUserConfigurationFromFileAction,
    LoadConfigFromDeviceReplyAction,
    LoadUserConfigSuccessAction,
    LoadUserConfigurationFromFileAction,
    NavigateToModuleSettings,
    PreviewUserConfigurationAction,
    SaveUserConfigSuccessAction,
    SelectModuleConfigurationAction,
    UserConfigurationNewerAction
} from '../actions/user-config';

import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { Uhk80MigratorService } from '../../services/uhk80-migrator.service';
import {
    AppState,
    getConnectedDevice,
    getHardwareModules,
    getPrevUserConfiguration,
    getRouterState,
    getUserConfiguration,
    disableUpdateAgentProtection,
} from '../index';
import * as Keymaps from '../actions/keymap';
import * as Macros from '../actions/macro';
import {
    DismissUndoNotificationAction,
    LoadHardwareConfigurationSuccessAction,
    ShowNotificationAction,
    UndoLastAction,
    NavigateTo
} from '../actions/app';
import {
    ActionTypes as DeviceActionTypes,
    BackupUserConfigurationAction,
    ChangeDeviceAction,
    CheckAreHostConnectionsPairedAction,
    HardwareModulesLoadedAction,
    ShowSaveToKeyboardButtonAction,
    SaveConfigurationAction,
} from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';
import { UndoUserConfigData } from '../../models/undo-user-config-data';
import { RouterState } from '../router-util.js';

@Injectable()
export class UserConfigEffects {
    private readonly actions$ = inject(Actions);
    private readonly dataStorageRepository = inject(DataStorageRepositoryService);
    private readonly defaultUserConfigurationService = inject(DefaultUserConfigurationService);
    private readonly deviceRendererService = inject(DeviceRendererService);
    private readonly logService = inject(LogService);
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly uhk80MigratorService = inject(Uhk80MigratorService);

    loadUserConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType(ROOT_EFFECTS_INIT),
            switchMap(() => this.getUserConfiguration(UHK_60_DEVICE)
                .pipe(
                    map(userConfig => new LoadUserConfigSuccessAction(userConfig))
                )
            )
        )
    );

    addNewPairedDevives$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.AddNewPairedDevicesToHostConnections),
            map(() => new SaveConfigurationAction(true))
        ));

    changeDevice$ = createEffect(() => this.actions$
        .pipe(
            ofType<ChangeDeviceAction>(DeviceActionTypes.ChangeDevice),
            switchMap((action) => this.getUserConfiguration(action.payload)
                .pipe(
                    map(userConfig => new LoadUserConfigSuccessAction(userConfig))
                )
            )
        )
    );

    saveUserConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType(
                Keymaps.ActionTypes.Add, Keymaps.ActionTypes.Duplicate, Keymaps.ActionTypes.EditName,
                Keymaps.ActionTypes.EditAbbr, Keymaps.ActionTypes.SetDefault, Keymaps.ActionTypes.Remove,
                Keymaps.ActionTypes.SaveKey, Keymaps.ActionTypes.EditDescription, Keymaps.ActionTypes.ExchangeKeys,
                Keymaps.ActionTypes.AddLayer, Keymaps.ActionTypes.RemoveLayer, Keymaps.ActionTypes.SetKeyColor,
                Keymaps.ActionTypes.PasteLayer,
                Macros.ActionTypes.Add, Macros.ActionTypes.Duplicate, Macros.ActionTypes.EditName, Macros.ActionTypes.Remove,
                Macros.ActionTypes.AddAction, Macros.ActionTypes.SaveAction, Macros.ActionTypes.DeleteAction,
                Macros.ActionTypes.ReorderAction, Macros.ActionTypes.DuplicateAction,
                ActionTypes.RenameUserConfiguration, ActionTypes.SetUserConfigurationValue, ActionTypes.SetUserConfigurationRgbValue,
                ActionTypes.RecoverLEDSpaces, ActionTypes.SetModuleConfigurationValue,
                ActionTypes.ReorderHostConnections, ActionTypes.RenameHostConnection, ActionTypes.SetHostConnectionSwitchover,
                ActionTypes.LoadTypingBehaviorPreset,
            ),
            filter(action => !isNavigateToMacroSaveKey(action)),
            withLatestFrom(this.store.select(getUserConfiguration), this.store.select(getPrevUserConfiguration), this.store.select(getConnectedDevice)),
            mergeMap(([action, config, prevUserConfiguration, uhkDeviceProduct]) => {
                config = Object.assign(new UserConfiguration(), config);
                config.recalculateConfigurationLength();

                return this.dataStorageRepository.saveConfig(config, uhkDeviceProduct)
                    .pipe(
                        mergeMap(() => {
                            if (action.type === Keymaps.ActionTypes.Remove || action.type === Macros.ActionTypes.Remove) {
                                const text = action.type === Keymaps.ActionTypes.Remove ? 'Keymap' : 'Macro';
                                const pathPrefix = action.type === Keymaps.ActionTypes.Remove ? 'keymap' : 'macro';
                                const payload: UndoUserConfigData = {
                                    path: `/${pathPrefix}/${(action as Keymaps.RemoveKeymapAction | Macros.RemoveMacroAction).payload}`,
                                    config: prevUserConfiguration.clone(),
                                    uhkDeviceProduct,
                                };

                                return [
                                    new SaveUserConfigSuccessAction(config),
                                    new ShowNotificationAction({
                                        type: NotificationType.Undoable,
                                        message: `${text} has been deleted`,
                                        extra: {
                                            payload,
                                            type: Keymaps.ActionTypes.UndoLastAction
                                        }
                                    }),
                                    new ShowSaveToKeyboardButtonAction()
                                ];
                            }

                            return [
                                new SaveUserConfigSuccessAction(config),
                                new DismissUndoNotificationAction(),
                                new ShowSaveToKeyboardButtonAction()
                            ];
                        })
                    );
            })
        )
    );

    undoUserConfig$ = createEffect(() => this.actions$
        .pipe(
            ofType<UndoLastAction>(Keymaps.ActionTypes.UndoLastAction),
            map(action => action.payload),
            switchMap((payload: UndoUserConfigData) => this.dataStorageRepository.saveConfig(payload.config, payload.uhkDeviceProduct)
                .pipe(
                    tap(() => { this.router.navigate([payload.path]); }),
                    map(() => new LoadUserConfigSuccessAction(payload.config))
                )
            )
        )
    );

    loadConfigFromDevice$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.LoadConfigFromDevice),
            tap(() => this.deviceRendererService.loadConfigurationFromKeyboard())
        ),
    { dispatch: false }
    );

    loadConfigFromDeviceReply$ = createEffect(() => this.actions$
        .pipe(
            ofType<LoadConfigFromDeviceReplyAction>(ActionTypes.LoadConfigFromDeviceReply),
            withLatestFrom(
                this.store.select(getRouterState),
                this.store.select(disableUpdateAgentProtection),
                this.store.select(getConnectedDevice),
            ),
            mergeMap(([action, route, disableUpdateAgentProtection, uhkDeviceProduct]) => {
                const data: ConfigurationReply = action.payload;

                if (!data.success) {
                    return [new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: data.error
                    })];
                }

                const result = [];
                let newPageDestination: Array<string>;

                const parsedUserConfiguration = getUserConfigFromDeviceResponse(data.userConfiguration);
                switch (parsedUserConfiguration.result) {
                    case "success": {
                        this.logService.config('[UserConfigEffect] Loaded user configuration', parsedUserConfiguration.userConfiguration);
                        result.push(new LoadUserConfigSuccessAction(parsedUserConfiguration.userConfiguration));
                        result.push(new CheckAreHostConnectionsPairedAction());

                        if (route.state
                            && !route.state.url.startsWith('/device/firmware')
                            && !route.state.url.startsWith('/update-firmware')) {
                            newPageDestination = ['/'];
                        }
                        break
                    }

                    case "newer": {
                        if (data.backupConfiguration.info === BackupUserConfigurationInfo.LastCompatible
                            || data.backupConfiguration.info === BackupUserConfigurationInfo.EarlierCompatible) {
                            const userConfig = new UserConfiguration().fromJsonObject(data.backupConfiguration.userConfiguration);
                            result.push(new UserConfigurationNewerAction({
                                date: data.backupConfiguration.date,
                                userConfiguration: userConfig,
                                newUserConfigurationVersion: parsedUserConfiguration.userConfigurationVersion,
                                type: 'backup',
                            }));
                        }
                        else {
                            const config = this.defaultUserConfigurationService.getResetUserConfiguration(uhkDeviceProduct);
                            result.push(new UserConfigurationNewerAction({
                                type: 'reset',
                                newUserConfigurationVersion: parsedUserConfiguration.userConfigurationVersion,
                                userConfiguration: config,
                            }));
                        }

                        if (disableUpdateAgentProtection) {
                            newPageDestination = ['/'];
                        }
                        else {
                            newPageDestination = ['/update-agent'];
                        }
                        break;
                    }

                    default: {
                        this.logService.error('Eeprom user-config parse error:', parsedUserConfiguration.error);
                        result.push(new BackupUserConfigurationAction(data.backupConfiguration));
                        if (data.backupConfiguration.info === BackupUserConfigurationInfo.LastCompatible
                            || data.backupConfiguration.info === BackupUserConfigurationInfo.EarlierCompatible) {
                            const userConfig = new UserConfiguration().fromJsonObject(data.backupConfiguration.userConfiguration);
                            result.push(new LoadUserConfigSuccessAction(userConfig));
                        }

                        newPageDestination = ['/device/restore-user-configuration'];
                        break
                    }
                }

                try {
                    const hardwareConfig = getHardwareConfigFromDeviceResponse(data.hardwareConfiguration);
                    result.push(new LoadHardwareConfigurationSuccessAction(hardwareConfig));
                } catch (err) {
                    this.logService.error('Eeprom hardware-config parse error:', err);
                    result.push(
                        new ShowNotificationAction({
                            type: NotificationType.Error,
                            message: err
                        }));
                }

                result.push(new HardwareModulesLoadedAction(data.modules));

                if (newPageDestination) {
                    result.push(new NavigateTo({ commands: newPageDestination }));
                }

                return result;
            })
        )
    );

    saveUserConfigInJsonFile$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.SaveUserConfigInJsonFile),
            withLatestFrom(this.store.select(getUserConfiguration), this.store.select(getHardwareModules)),
            tap(([action, userConfiguration, hardwareModules]) => {
                const newUserConfiguration= updateUserConfigurationWithLastSaveInfo(userConfiguration, hardwareModules.rightModuleInfo);
                const asString = JSON.stringify(newUserConfiguration.toJsonObject(), null, 2);
                const asBlob = new Blob([asString], { type: 'text/plain' });
                saveAs(asBlob, 'UserConfiguration.json');
            })
        ),
    { dispatch: false }
    );

    saveUserConfigInBinFile$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.SaveUserConfigInBinFile),
            withLatestFrom(this.store.select(getUserConfiguration), this.store.select(getHardwareModules)),
            tap(([action, userConfiguration, hardwareModules]) => {
                const newUserConfiguration= updateUserConfigurationWithLastSaveInfo(userConfiguration, hardwareModules.rightModuleInfo);
                const uhkBuffer = new UhkBuffer();
                newUserConfiguration.toBinary(uhkBuffer);
                const blob = new Blob([uhkBuffer.getBufferContent()]);
                saveAs(blob, 'UserConfiguration.bin');
            })
        ),
    { dispatch: false }
    );

    loadUserConfigurationFromFile$ = createEffect(() => this.actions$
        .pipe(
            ofType<LoadUserConfigurationFromFileAction>(ActionTypes.LoadUserConfigurationFromFile),
            withLatestFrom(
                this.store.select(getUserConfiguration),
                this.store.select(disableUpdateAgentProtection),
                this.store.select(getHardwareModules),
            ),
            map(([action, currentUserConfiguration, disableUpdateAgentProtection, hardwareModules]) => {
                const payload = action.payload;
                const deviceName = currentUserConfiguration.deviceName;
                const firmwareUserConfigVersion = hardwareModules.rightModuleInfo?.userConfigVersion;
                const userConfigTooHighForAgentNotification = (importedVersion: string) => new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: `The imported user configuration version (${importedVersion}) is too high for this Agent (supports up to ${VERSIONS.userConfigVersion}). Please update Agent.`
                });
                const userConfigTooHighForFirmwareNotification = (importedVersion: string) => new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: `The imported user configuration version (${importedVersion}) is too high for this firmware (supports up to ${firmwareUserConfigVersion}). Please update the firmware or use a compatible configuration.`
                });

                let importedUserConfigVersion: string | undefined;

                try {
                    let userConfig = new UserConfiguration();

                    if (payload.uploadFileData.filename.endsWith('.bin')) {
                        const uhkBuffer = UhkBuffer.fromArray(payload.uploadFileData.data);
                        importedUserConfigVersion = readUserConfigurationVersionFromBinary(uhkBuffer);
                        if (shouldUpgradeAgent(importedUserConfigVersion, disableUpdateAgentProtection)) {
                            return userConfigTooHighForAgentNotification(importedUserConfigVersion);
                        }
                        if (isUserConfigVersionHigherThanFirmware(importedUserConfigVersion, firmwareUserConfigVersion)) {
                            return userConfigTooHighForFirmwareNotification(importedUserConfigVersion);
                        }
                        userConfig.fromBinary(uhkBuffer);
                    } else {
                        const buffer = Buffer.from(payload.uploadFileData.data);
                        const json = JSON.parse(buffer.toString());
                        importedUserConfigVersion = readUserConfigurationVersionFromJsonObject(json);
                        if (importedUserConfigVersion
                            && shouldUpgradeAgent(importedUserConfigVersion, disableUpdateAgentProtection)) {
                            return userConfigTooHighForAgentNotification(importedUserConfigVersion);
                        }
                        if (importedUserConfigVersion
                            && isUserConfigVersionHigherThanFirmware(importedUserConfigVersion, firmwareUserConfigVersion)) {
                            return userConfigTooHighForFirmwareNotification(importedUserConfigVersion);
                        }
                        userConfig.fromJsonObject(json);
                    }

                    if (userConfig.userConfigMajorVersion) {
                        userConfig = this.uhk80MigratorService.migrate(userConfig);

                        // Keep the connected keyboard's name when importing a config, so a single config
                        // can be shared across multiple keyboards while each retains its own name.
                        if (deviceName !== DEFAULT_DEVICE_NAME) {
                            userConfig.deviceName = deviceName;
                        }

                        if (payload.autoSave) {
                            return new ApplyUserConfigurationFromFileAction({
                                userConfig,
                                saveInHistory: payload.uploadFileData.saveInHistory
                            });
                        } else {
                            return new PreviewUserConfigurationAction(userConfig);
                        }
                    }

                    return new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: 'Invalid configuration specified.'
                    });
                } catch (err) {
                    if (importedUserConfigVersion
                        && shouldUpgradeAgent(importedUserConfigVersion, false)) {
                        return userConfigTooHighForAgentNotification(importedUserConfigVersion);
                    }
                    if (importedUserConfigVersion
                        && isUserConfigVersionHigherThanFirmware(importedUserConfigVersion, firmwareUserConfigVersion)) {
                        return userConfigTooHighForFirmwareNotification(importedUserConfigVersion);
                    }

                    return new ShowNotificationAction({
                        type: NotificationType.Error,
                        message: 'Invalid configuration specified.'
                    });
                }
            })
        )
    );

    navigateToModuleSettings$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.NavigateToModuleSettings),
            tap((action: NavigateToModuleSettings) => {
                for(const module of UHK_MODULES) {
                    if (module.id === action.payload.moduleId) {
                        this.router.navigate(
                            [module.configPath],
                            {
                                queryParams: {
                                    backSuffix: action.payload.backSuffix,
                                    backText: action.payload.backText,
                                    backUrl: action.payload.backUrl,
                                },
                            },
                        );
                        return;
                    }
                }
            })
        ),
    { dispatch: false }
    );

    previewUserConfiguration$ = createEffect(() => this.actions$
        .pipe(
            ofType<PreviewUserConfigurationAction>(ActionTypes.PreviewUserConfiguration),
            map(() => new ShowSaveToKeyboardButtonAction())
        )
    );

    moduleConfigurationNavigated$ = createEffect(() => this.actions$
        .pipe(
            ofType(routerNavigatedAction),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map<RouterNavigatedAction, RouterState>(action => action.payload.routerState as any),
            filter(routerState => routerState.url.startsWith('/add-on')),
            map(routerState => {
                const uhkModule = UHK_MODULES.find(module => module.configPath === routerState.pathname);

                if (uhkModule) {
                    return new SelectModuleConfigurationAction(uhkModule.id);
                }

                return new EmptyAction();
            }),
            distinctUntilChanged(),
        ));

    resetKeymapQueryParams$ = createEffect(() => this.actions$
        .pipe(
            ofType(Keymaps.ActionTypes.SaveKey, Keymaps.ActionTypes.ClosePopover),
            filter(action => {
                if (action.type !== Keymaps.ActionTypes.SaveKey) {
                    return true;
                }

                const keyAction = (action as Keymaps.SaveKeyAction).payload.keyAction;

                return !keyAction.navigateToMacro && !keyAction.assignNewMacro;
            }),
            tap(() => {
                this.router.navigate([], {
                    queryParams: {
                        module: null,
                        key: null,
                        remapOnAllKeymap: null,
                        remapOnAllLayer: null,
                    },
                    queryParamsHandling: 'merge'
                })
            })
        ),
    { dispatch: false }
    );

    private getUserConfiguration(uhkDeviceProduct: UhkDeviceProduct): Observable<UserConfiguration> {
        return this.dataStorageRepository.getConfig(uhkDeviceProduct)
            .pipe(
                map(configJsonObject => {
                    let config: UserConfiguration;
                    const defaultConfig = this.defaultUserConfigurationService.getDefaultUserConfigurationOfUhkDeviceProduct(uhkDeviceProduct);

                    if (configJsonObject) {
                        if (configJsonObject.userConfigMajorVersion === defaultConfig.userConfigMajorVersion) {
                            config = new UserConfiguration().fromJsonObject(configJsonObject);
                        }
                    }

                    if (!config) {
                        config = defaultConfig;
                    }

                    return config;
                })
            );
    }
}

function isNavigateToMacroSaveKey(action: Action): boolean {
    if (action.type !== Keymaps.ActionTypes.SaveKey) {
        return false;
    }

    const keyAction = (action as Keymaps.SaveKeyAction).payload.keyAction;
    return keyAction.navigateToMacro && !keyAction.assignNewMacro;
}

function updateUserConfigurationWithLastSaveInfo(userConfiguration: UserConfiguration, rightModuleInfo: RightModuleInfo) {
    const newUserConfiguration = userConfiguration.clone()
    newUserConfiguration.lastSaveAgentTag = `${VERSIONS.agentRepo}/${VERSIONS.agentTag}`;
    newUserConfiguration.lastSaveFirmwareTag = `${rightModuleInfo.firmwareGitRepo}/${rightModuleInfo.firmwareGitTag}`
    newUserConfiguration.recalculateConfigurationLength();

    return newUserConfiguration;
}
