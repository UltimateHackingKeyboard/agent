import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { gt } from 'semver';
import {
    Constants,
    FirmwareRepoInfo,
    LayerName,
    LEFT_KEY_CLUSTER_MODULE,
    RIGHT_TRACKPOINT_MODULE,
    UHK_OFFICIAL_FIRMWARE_REPO
} from 'uhk-common';

import {
    ApplicationSettings,
    AppTheme,
    AppThemeSelect,
    createMd5Hash,
    getEmptyKeymap,
    getMd5HashFromFilename,
    isVersionGte,
    HardwareModules,
    Keymap,
    LEFT_HALF_MODULE,
    LeftSlotModules,
    PlayMacroAction,
    RightSlotModules,
    UHK_60_DEVICE,
    UhkBuffer,
    UserConfiguration,
    VersionInformation
} from 'uhk-common';

import * as fromDefaultUserConfig from './reducers/default-user-configuration.reducer';
import * as fromUserConfig from './reducers/user-configuration';
import * as fromAppUpdate from './reducers/app-update.reducer';
import * as fromContributors from './reducers/contributors.reducer';
import * as autoUpdateSettings from './reducers/auto-update-settings';
import * as fromApp from './reducers/app.reducer';
import * as fromDevice from './reducers/device';
import * as fromFirmware from './reducers/firmware-upgrade.reducer';
import * as fromUserConfigHistory from './reducers/user-configuration-history.reducer';
import * as fromSelectors from './reducers/selectors';
import * as fromSmartMacroDoc from './reducers/smart-macro-doc.reducer';
import { initProgressButtonState } from './reducers/progress-button-state';
import { environment } from '../../environments/environment';
import { RouterState } from './router-util';
import { PrivilagePageSate } from '../models/privilage-page-sate';
import {
    DeviceUiStates,
    FirmwareUpgradeState,
    MacroMenuItem,
    ModuleFirmwareUpgradeStates,
    OutOfSpaceWarningData,
    SideMenuPageState,
    UhkProgressBarState,
    UserConfigHistoryComponentState
} from '../models';
import { SelectOptionData } from '../models/select-option-data';
import { addMissingModuleConfigs } from './reducers/add-missing-module-configs';

// State interface for the application
export interface AppState {
    defaultUserConfiguration: fromDefaultUserConfig.State;
    userConfiguration: fromUserConfig.State;
    autoUpdateSettings: autoUpdateSettings.State;
    app: fromApp.State;
    router: RouterReducerState<RouterState>;
    appUpdate: fromAppUpdate.State;
    device: fromDevice.State;
    contributors: fromContributors.State;
    firmware: fromFirmware.State;
    smartMacroDoc: fromSmartMacroDoc.State;
    userConfigurationHistory: fromUserConfigHistory.State;
}

export const reducers: ActionReducerMap<AppState> = {
    defaultUserConfiguration: fromDefaultUserConfig.reducer,
    userConfiguration: fromUserConfig.reducer,
    autoUpdateSettings: autoUpdateSettings.reducer,
    app: fromApp.reducer,
    router: routerReducer,
    appUpdate: fromAppUpdate.reducer,
    device: fromDevice.reducer,
    contributors: fromContributors.reducer,
    firmware: fromFirmware.reducer,
    smartMacroDoc: fromSmartMacroDoc.reducer,
    userConfigurationHistory: fromUserConfigHistory.reducer
};

export const metaReducers: MetaReducer<AppState>[] = environment.production
    ? []
    : [storeFreeze];

export const userConfigState = (state: AppState) => state.userConfiguration;

export const getUserConfiguration = createSelector(userConfigState, fromUserConfig.getUserConfiguration);
export const getKeymaps = createSelector(userConfigState, fromUserConfig.getKeymaps);
export const getDefaultKeymap = createSelector(userConfigState, fromUserConfig.getDefaultKeymap);
export const getSelectedKeymap = createSelector(userConfigState, fromUserConfig.getSelectedKeymap);
export const getMacros = createSelector(userConfigState, fromUserConfig.getMacros);
export const getSelectedMacro = createSelector(userConfigState, fromUserConfig.getSelectedMacro);
export const isSelectedMacroNew = createSelector(userConfigState, fromUserConfig.isSelectedMacroNew);
export const isKeymapDeletable = createSelector(userConfigState, fromUserConfig.isKeymapDeletable);
export const hasMacro = createSelector(userConfigState, fromUserConfig.hasMacro);
export const getMacroMap = createSelector(userConfigState, fromUserConfig.getMacroMap);
export const lastEditedKey = createSelector(userConfigState, fromUserConfig.lastEditedKey);
export const getSelectedLayerOption = createSelector(userConfigState, fromUserConfig.getSelectedLayerOption);
export const getLayerOptions = createSelector(userConfigState, fromUserConfig.getLayerOptions);
export const getSecondaryRoleOptions = createSelector(getSelectedLayerOption, getLayerOptions,
    (selectedLayer, layerOptions): SelectOptionData[] => {
        if (selectedLayer?.id !== LayerName.base) {
            return [];
        }

        const result: SelectOptionData[] = [];
        for(const layerOption of layerOptions) {
            if (layerOption.secondaryRole === undefined || !layerOption.selected) {
                continue;
            }

            result.push({
                id: `${layerOption.secondaryRole}`,
                text: layerOption.name,
            });
        }

        return result;
    });

export const getSelectedMacroAction = createSelector(userConfigState, fromUserConfig.getSelectedMacroAction);
export const getKeymapOptions = createSelector(getKeymaps, getSelectedKeymap, (keymaps, selectedKeymap): SelectOptionData[] => {
    return keymaps.map(keymap => {
        return {
            id: keymap.abbreviation,
            text: keymap.name,
            disabled: keymap.abbreviation === selectedKeymap.abbreviation
        };
    });
});
export const appState = (state: AppState) => state.app;
export const showAddonMenu = createSelector(appState, fromApp.showAddonMenu);
export const disableUpdateAgentProtection = createSelector(appState, fromApp.disableUpdateAgentProtection);
export const getUndoableNotification = createSelector(appState, fromApp.getUndoableNotification);
export const getPrevUserConfiguration = createSelector(appState, fromApp.getPrevUserConfiguration);
export const runningInElectron = createSelector(appState, fromApp.runningInElectron);
export const getKeyboardLayout = createSelector(appState, fromApp.getKeyboardLayout);
export const deviceConfigurationLoaded = createSelector(appState, fromApp.deviceConfigurationLoaded);
export const getAgentVersionInfo = createSelector(appState, fromApp.getAgentVersionInfo);
export const getOperatingSystem = createSelector(appState, fromSelectors.getOperatingSystem);
export const keypressCapturing = createSelector(appState, fromApp.keypressCapturing);
export const runningOnNotSupportedWindows = createSelector(appState, fromApp.runningOnNotSupportedWindows);
export const contributors = (state: AppState) => state.contributors;
export const firmwareUpgradeAllowed = createSelector(runningOnNotSupportedWindows, notSupportedOs => !notSupportedOs);
export const getEverAttemptedSavingToKeyboard = createSelector(appState, fromApp.getEverAttemptedSavingToKeyboard);
export const getUdevFileContent = createSelector(appState, fromApp.getUdevFileContent);
export const getAnimationEnabled = createSelector(appState, fromApp.getAnimationEnabled);
export const getAppTheme = createSelector(appState, fromApp.getAppTheme);
export const getPlatform = createSelector(appState, fromApp.getPlatform);

export const appUpdateState = (state: AppState) => state.appUpdate;
export const getShowAppUpdateAvailable = createSelector(appUpdateState, fromAppUpdate.getShowAppUpdateAvailable);
export const getUpdateInfo = createSelector(appUpdateState, fromAppUpdate.getUpdateInfo);
export const isForceUpdate = createSelector(appUpdateState, fromAppUpdate.isForceUpdate);

export const appUpdateSettingsState = (state: AppState) => state.autoUpdateSettings;

export const deviceState = (state: AppState) => state.device;
export const firmwareState = (state: AppState) => state.firmware;
export const updatingFirmware = createSelector(firmwareState, fromFirmware.updatingFirmware);
export const deviceConnected = createSelector(
    runningInElectron, deviceState, appState, updatingFirmware,
    (electron, device, app, upgradingFirmware) => {
        if (!electron) {
            return true;
        }

        if (app.platform === 'linux') {
            return device.connectedDevice && (device.zeroInterfaceAvailable || upgradingFirmware);
        }

        return !!device.connectedDevice;
    });
export const hasDevicePermission = createSelector(deviceState, fromDevice.hasDevicePermission);
export const getMissingDeviceState = createSelector(deviceState, fromDevice.getMissingDeviceState);
export const xtermLog = createSelector(firmwareState, fromFirmware.xtermLog);
// tslint:disable-next-line: max-line-length
export const flashFirmwareButtonDisabled = createSelector(runningInElectron, updatingFirmware, (electron, upgradingFirmware) => !electron || upgradingFirmware);
export const getStateHardwareModules = createSelector(deviceState, fromDevice.getHardwareModules);
export const getHardwareModules = createSelector(runningInElectron, getStateHardwareModules, getAgentVersionInfo,
    (electron, hardwareModules, agentVersionInfo): HardwareModules => {
        if (electron) {
            return hardwareModules;
        }

        return {
            moduleInfos: [
                {
                    module: LEFT_HALF_MODULE,
                    info: {
                        firmwareVersion: agentVersionInfo.firmwareVersion,
                        moduleProtocolVersion: agentVersionInfo.moduleProtocolVersion
                    }
                },
                {
                    module: LEFT_KEY_CLUSTER_MODULE,
                    info: {
                        firmwareVersion: agentVersionInfo.firmwareVersion,
                        moduleProtocolVersion: agentVersionInfo.moduleProtocolVersion
                    }
                },
                {
                    module: RIGHT_TRACKPOINT_MODULE,
                    info: {
                        firmwareVersion: agentVersionInfo.firmwareVersion,
                        moduleProtocolVersion: agentVersionInfo.moduleProtocolVersion
                    }
                }
            ],
            rightModuleInfo: {
                deviceProtocolVersion: agentVersionInfo.deviceProtocolVersion,
                hardwareConfigVersion: agentVersionInfo.hardwareConfigVersion,
                firmwareVersion: agentVersionInfo.firmwareVersion,
                firmwareGitRepo: UHK_OFFICIAL_FIRMWARE_REPO,
                firmwareGitTag: 'master',
                moduleProtocolVersion: agentVersionInfo.moduleProtocolVersion,
                userConfigVersion: agentVersionInfo.userConfigVersion
            }
        };
    });
export const getSmartMacroDocModuleIds = createSelector(getHardwareModules, (hardwareModules): Array<number> => {
    return hardwareModules.moduleInfos
        .filter(moduleInfo => moduleInfo.module.id > 1)
        .map(moduleInfo => moduleInfo.module.id);
});
export const getRightModuleFirmwareRepoInfo = createSelector(getHardwareModules, (hardwareModules): FirmwareRepoInfo => {
    return {
        firmwareGitRepo: hardwareModules?.rightModuleInfo?.firmwareGitRepo || '',
        firmwareGitTag: hardwareModules?.rightModuleInfo?.firmwareGitTag || '',
    };
});
export const getBackupUserConfigurationState = createSelector(deviceState, fromDevice.getBackupUserConfigurationState);
export const getRestoreUserConfiguration = createSelector(deviceState, fromDevice.getHasBackupUserConfiguration);
export const bootloaderActive = createSelector(deviceState, fromDevice.bootloaderActive);
export const firmwareUpgradeFailed = createSelector(firmwareState, fromFirmware.firmwareUpgradeFailed);
export const firmwareUpgradeSuccess = createSelector(firmwareState, fromFirmware.firmwareUpgradeSuccess);
export const getHalvesInfo = createSelector(deviceState, fromDevice.halvesInfo);
export const isUserConfigSaving = createSelector(deviceState, fromDevice.isUserConfigSaving);
export const deviceUiState = createSelector(deviceState, fromDevice.deviceUiState);
export const getConnectedDevice = createSelector(deviceState, fromDevice.getConnectedDevice);
export const getSkipFirmwareUpgrade = createSelector(deviceState, fromDevice.getSkipFirmwareUpgrade);
export const getUserConfigAsBuffer = createSelector(getUserConfiguration, userConfig => {
    const json = userConfig.toJsonObject();
    const config = new UserConfiguration().fromJsonObject(json);
    const uhkBuffer = new UhkBuffer();
    config.toBinary(uhkBuffer);

    return uhkBuffer;
});
export const getUserConfigSize = createSelector(getUserConfigAsBuffer, uhkBuffer => {
    return uhkBuffer.getBufferContent().length;
});
export const getMd5HasOfUserConfig = createSelector(getUserConfigAsBuffer, uhkBuffer => {
    return createMd5Hash(uhkBuffer.getBufferContent());
});
export const getConfigSizesState = createSelector(deviceState, getUserConfigSize, runningInElectron,
    (deviceStateData, userConfigSize, isRunningInElectron) => {
        const formatNumber = new Intl.NumberFormat(undefined, {
            useGrouping: true
        }).format;
        const maxValue = deviceStateData.configSizes.userConfig;

        return {
            currentValue: userConfigSize,
            maxValue,
            loading: isRunningInElectron && deviceStateData.readingConfigSizes,
            minValue: 0,
            text: `${formatNumber(userConfigSize)} of ${formatNumber(maxValue)} bytes on-board storage in used`
        };
    });
export const getOutOfSpaceWaringData = createSelector(getConfigSizesState,
    (configSizeState: UhkProgressBarState): OutOfSpaceWarningData => ({
        currentValue: configSizeState.currentValue,
        maxValue: configSizeState.maxValue,
        show: configSizeState.currentValue > configSizeState.maxValue
    }));
export const saveToKeyboardStateSelector = createSelector(deviceState, fromDevice.getSaveToKeyboardState);
export const saveToKeyboardState = createSelector(runningInElectron, saveToKeyboardStateSelector, getOutOfSpaceWaringData,
    (electron, saveToKeyboard, outOfSpaceWarning) => {
        if (!electron) {
            return initProgressButtonState;
        }

        return {
            ...saveToKeyboard,
            showButton: saveToKeyboard.showButton && !outOfSpaceWarning.show
        };
    });
export const firstAttemptOfSaveToKeyboard = createSelector(
    runningInElectron,
    getEverAttemptedSavingToKeyboard,
    saveToKeyboardState,
    (electron, everAttemptedSavingToKeyboard, saveToKeyboard): boolean => {
        return electron ? !everAttemptedSavingToKeyboard && saveToKeyboard.showButton : false;
    });
export const getPrivilegePageState = createSelector(
    appState, getUdevFileContent,
    (app, udevFileContent): PrivilagePageSate => {
        const permissionSetupFailed = !!app.permissionError;

        return {
            permissionSetupFailed,
            udevFileContent,
            showWhatWillThisDo: !app.privilegeWhatWillThisDoClicked && !permissionSetupFailed,
            showWhatWillThisDoContent: app.privilegeWhatWillThisDoClicked || permissionSetupFailed
        };
    });

export const getMacroMenuItems = (userConfiguration: UserConfiguration): MacroMenuItem[] => {
    const macroMap = userConfiguration.macros.reduce((map, macro) => {
        return map.set(macro.id, {
            id: macro.id,
            name: macro.name,
            usageCount: 0
        });
    }, new Map<number, MacroMenuItem>());

    for (const keymap of userConfiguration.keymaps) {
        for (const layer of keymap.layers) {
            for (const module of layer.modules) {
                for (const keyAction of module.keyActions) {
                    if (!(keyAction instanceof PlayMacroAction)) {
                        continue;
                    }

                    const menuItem = macroMap.get(keyAction.macroId);
                    menuItem.usageCount++;
                }
            }
        }
    }

    return Array
        .from(macroMap.values())
        .sort((first: MacroMenuItem, second: MacroMenuItem) => first.name.localeCompare(second.name));
};

export const calculateDeviceUiState = createSelector(
    deviceUiState,
    deviceConfigurationLoaded,
    disableUpdateAgentProtection,
    (uiState, deviceConfigLoaded, disableUpdateAgentProtection): DeviceUiStates | undefined => {
        if (uiState) {

            if(disableUpdateAgentProtection && uiState === DeviceUiStates.UpdateNeeded)
                return;

            return uiState;
        }

        if (!deviceConfigLoaded) {
            return DeviceUiStates.Loading;
        }
    }
);

export const getSideMenuPageState = createSelector(
    showAddonMenu,
    runningInElectron,
    updatingFirmware,
    getUserConfiguration,
    getRestoreUserConfiguration,
    calculateDeviceUiState,
    getConnectedDevice,
    (showAddonMenuValue: boolean,
        runningInElectronValue: boolean,
        updatingFirmwareValue: boolean,
        userConfiguration: UserConfiguration,
        restoreUserConfiguration: boolean,
        uiState,
        connectedDevice): SideMenuPageState => {
        const macros = getMacroMenuItems(userConfiguration);

        return {
            connectedDevice: runningInElectronValue ? connectedDevice : UHK_60_DEVICE,
            showAddonMenu: showAddonMenuValue,
            runInElectron: runningInElectronValue,
            updatingFirmware: updatingFirmwareValue,
            deviceName: userConfiguration.deviceName,
            keymaps: userConfiguration.keymaps,
            macros,
            maxMacroCountReached: macros.length >= Constants.MAX_ALLOWED_MACROS,
            restoreUserConfiguration,
            deviceUiState: runningInElectronValue ? uiState : DeviceUiStates.UserConfigLoaded
        };
    }
);

export const maxMacroCountReached = createSelector(getSideMenuPageState, sideMenuState => sideMenuState.maxMacroCountReached);

export const getRouterState = (state: AppState) => state.router;

export const macroPlaybackSupported = createSelector(getHardwareModules, (hardwareModules: HardwareModules): boolean => {
    return isVersionGte(hardwareModules.rightModuleInfo.firmwareVersion, '8.4.3');
});
export const layerDoubleTapSupported = createSelector(
    getHardwareModules,
    (hardwareModules: HardwareModules): boolean => {
        return isVersionGte(hardwareModules.rightModuleInfo.firmwareVersion, '8.4.3');
    }
);
export const extraMouseButtonsSupported = createSelector(getHardwareModules, (hardwareModules: HardwareModules): boolean => {
    return isVersionGte(hardwareModules.rightModuleInfo.userConfigVersion, '4.1.1');
});

export const extraLEDCharactersSupported = createSelector(getHardwareModules, (hardwareModules: HardwareModules): boolean => {
    return isVersionGte(hardwareModules.rightModuleInfo.userConfigVersion, '4.2.0');
});

export const isMacroCommandSupported = createSelector(getHardwareModules, (hardwareModules: HardwareModules): boolean => {
    return isVersionGte(hardwareModules.rightModuleInfo.userConfigVersion, '5.0.0');
});

export const getShowFirmwareUpgradePanel = createSelector(
    runningInElectron, getHardwareModules, getAgentVersionInfo, getSkipFirmwareUpgrade,
    (inElectron: boolean, hardwareModules:HardwareModules, agentVersionInfo: VersionInformation, skipFirmwareUpgrade: boolean): boolean => {
        return inElectron
            && skipFirmwareUpgrade
            && hardwareModules.rightModuleInfo.userConfigVersion
            && gt(agentVersionInfo.userConfigVersion, hardwareModules.rightModuleInfo.userConfigVersion);
    });

export const getUserConfigHistoryState = (state: AppState) => state.userConfigurationHistory;
export const getUserConfigHistoryComponentState = createSelector(
    runningInElectron,
    getUserConfigHistoryState,
    getMd5HasOfUserConfig,
    isUserConfigSaving,
    (inElectron,
        state: fromUserConfigHistory.State,
        md5Hash: string,
        saving: boolean): UserConfigHistoryComponentState => {
        let foundFirstCurrent = false;

        return {
            loading: inElectron && state.loading,
            files: state.files.map(x => {
                const showRestore = getMd5HashFromFilename(x) !== md5Hash;
                let displayText: string;

                if (showRestore) {
                    displayText = 'Restore';
                } else if (foundFirstCurrent) {
                    displayText = 'Same as current';
                } else {
                    displayText = 'Current';
                    foundFirstCurrent = true;
                }

                return {
                    displayText,
                    showRestore,
                    file: x
                };
            }),
            disabled: saving
        };
    });

export const getSupportedThemes = (): AppThemeSelect[] => {
    return [
        { id: AppTheme.System, text: 'Follow operating system theme' },
        { id: AppTheme.Light, text: 'Light' },
        { id: AppTheme.Dark, text: 'Dark' }
    ];
};

export const getStateFirmwareUpgradeState = createSelector(firmwareState, fromFirmware.firmwareUpgradeState);
export const getFirmwareUpgradeState = createSelector(runningInElectron, getStateFirmwareUpgradeState, getAgentVersionInfo,
    (electron, firmwareUpgrade, agentVersionInfo): FirmwareUpgradeState => {
        if (electron) {
            return firmwareUpgrade;
        }

        return {
            showForceFirmwareUpgrade: false,
            showForceFirmwareUpgradeWith: false,
            modules: [
                {
                    moduleName: 'Right keyboard half',
                    firmwareUpgradeSupported: true,
                    gitRepo: UHK_OFFICIAL_FIRMWARE_REPO,
                    isOfficialFirmware: true,
                    currentFirmwareVersion: agentVersionInfo.firmwareVersion,
                    newFirmwareVersion: undefined,
                    state: ModuleFirmwareUpgradeStates.Idle
                },
                {
                    moduleName: 'Left keyboard half',
                    firmwareUpgradeSupported: true,
                    gitRepo: UHK_OFFICIAL_FIRMWARE_REPO,
                    isOfficialFirmware: true,
                    currentFirmwareVersion: agentVersionInfo.firmwareVersion,
                    newFirmwareVersion: undefined,
                    state: ModuleFirmwareUpgradeStates.Idle
                }
            ],
            recoveryModules: []
        };
    });

export const defaultUserConfigState = (state: AppState) => state.defaultUserConfiguration;
export const getDefaultUserConfiguration = createSelector(
    defaultUserConfigState, fromDefaultUserConfig.getDefaultUserConfiguration);
export const getDefaultUserConfigurationKeymaps = createSelector(
    getDefaultUserConfiguration, getHalvesInfo, (userConfig, halvesInfo) => {
        let userConfiguration = userConfig;

        if (halvesInfo.leftModuleSlot !== LeftSlotModules.NoModule) {
            userConfiguration = addMissingModuleConfigs(userConfiguration, halvesInfo.leftModuleSlot, true);
        }
        if (halvesInfo.rightModuleSlot !== RightSlotModules.NoModule) {
            userConfiguration = addMissingModuleConfigs(userConfiguration, halvesInfo.rightModuleSlot, true);
        }

        return userConfiguration.keymaps;
    });
export const selectedKeymapAbbreviationAddKeymap = createSelector(
    defaultUserConfigState, fromDefaultUserConfig.selectedKeymapAbbreviation);
export const getSelectedAddKeymap = createSelector(
    getDefaultUserConfigurationKeymaps, selectedKeymapAbbreviationAddKeymap, (keymaps, abbreviation): Keymap => {
        return keymaps.find(x => x.abbreviation === abbreviation) || getEmptyKeymap();
    }
);
export const getLayerOptionsAddKeymap = createSelector(
    defaultUserConfigState, fromDefaultUserConfig.getLayerOptions);
export const getSelectedLayerOptionAddKeymap = createSelector(
    defaultUserConfigState, fromDefaultUserConfig.getSelectedLayerOption);

export const smartMacroDocState = (state: AppState) => state.smartMacroDoc;
export const selectSmartMacroDocUrl = createSelector(
    runningInElectron, smartMacroDocState, getRightModuleFirmwareRepoInfo,
    (isRunningInElectron, smartMacroState, firmwareRepoInfo) => {
        if (isRunningInElectron) {
            if (smartMacroState.firmwareDocState === fromSmartMacroDoc.FirmwareDocState.Loaded)
                return `http://127.0.0.1:${smartMacroState.port}/${firmwareRepoInfo.firmwareGitRepo}/${firmwareRepoInfo.firmwareGitTag}/index.html`;

            return `http://127.0.0.1:${smartMacroState.port}/loading.html`;
        }

        return 'https://ultimatehackingkeyboard.github.io/firmware/doc/index.html';
    });
export const getSmartMacroPanelWidth = createSelector(smartMacroDocState, fromSmartMacroDoc.getSmartMacroPanelWidth);
export const getSmartMacroPanelVisibility = createSelector(smartMacroDocState, fromSmartMacroDoc.getSmartMacroPanelVisibility);

export const getApplicationSettings = createSelector(
    appUpdateSettingsState,
    appState,
    getSmartMacroPanelWidth,
    (updateSettingsState,
        app,
        smartMacroPanelWidth
    ): ApplicationSettings => {
        return {
            checkForUpdateOnStartUp: updateSettingsState.checkForUpdateOnStartUp,
            everAttemptedSavingToKeyboard: app.everAttemptedSavingToKeyboard,
            animationEnabled: app.animationEnabled,
            appTheme: app.appTheme,
            smartMacroPanelWidth
        };
    });
