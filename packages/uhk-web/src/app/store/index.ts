import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { gt } from 'semver';
import {
    ApplicationSettings,
    AppTheme,
    AppThemeSelect,
    BacklightingMode,
    Constants,
    createMd5Hash,
    FirmwareRepoInfo,
    getEmptyKeymap,
    HardwareConfiguration,
    HardwareModules,
    HistoryFileInfo as CommonHistoryFileInfo,
    HostConnections,
    isVersionGte,
    Keymap,
    LayerName,
    LEFT_HALF_MODULE,
    LEFT_KEY_CLUSTER_MODULE,
    LeftSlotModules,
    PlayMacroAction,
    RIGHT_TRACKPOINT_MODULE,
    RightSlotModules,
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE,
    UHK_80_DEVICE,
    UHK_DEVICES,
    UHK_OFFICIAL_FIRMWARE_REPO,
    UhkBuffer,
    UhkThemeColors,
    UserConfiguration,
    VERSIONS,
} from 'uhk-common';
import { environment } from '../../environments/environment';
import {
    ConfigSizeState,
    DeviceUiStates,
    DongleOperations,
    DonglePairingState,
    DonglePairingStates,
    EraseBleSettingsButtonState,
    FirmwareUpgradeState,
    HistoryFileInfo,
    MacroMenuItem,
    ModuleFirmwareUpgradeStates,
    OutOfSpaceWarningData,
    OutOfSpaceWarningType,
    ProgressBar,
    ProgressBarLegend,
    SideMenuPageState,
    UhkProgressBarState,
    UserConfigHistoryComponentState
} from '../models';
import { PrivilagePageSate } from '../models/privilage-page-sate';
import { SelectOptionData } from '../models/select-option-data';
import { defaultUhkThemeColors } from '../util/default-uhk-theme-colors';
import { parseStatusBuffer } from '../util/status-buffer-parser';
import { addMissingModuleConfigs } from './reducers/add-missing-module-configs';

import * as fromAdvancedSettings from './reducers/advanced-settings.reducer';
import * as fromAppUpdate from './reducers/app-update.reducer';
import * as fromApp from './reducers/app.reducer';
import * as autoUpdateSettings from './reducers/auto-update-settings';
import * as fromContributors from './reducers/contributors.reducer';
import * as fromDefaultUserConfig from './reducers/default-user-configuration.reducer';
import * as fromDevice from './reducers/device';
import * as fromDongle from './reducers/dongle-pairing.reducer';
import * as fromFirmware from './reducers/firmware-upgrade.reducer';
import { initProgressButtonState } from './reducers/progress-button-state';
import * as fromSelectors from './reducers/selectors';
import * as fromSmartMacroDoc from './reducers/smart-macro-doc.reducer';
import * as fromUserConfig from './reducers/user-configuration';
import * as fromUserConfigHistory from './reducers/user-configuration-history.reducer';
import { RouterState } from './router-util';

// State interface for the application
export interface AppState {
    advanceSettings: fromAdvancedSettings.State;
    defaultUserConfiguration: fromDefaultUserConfig.State;
    dongle: fromDongle.State;
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
    advanceSettings: fromAdvancedSettings.reducer,
    defaultUserConfiguration: fromDefaultUserConfig.reducer,
    dongle: fromDongle.reducer,
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

export const advanceSettingsState = (state: AppState) => state.advanceSettings;
export const getIsAdvancedSettingsMenuVisible = createSelector(advanceSettingsState, fromAdvancedSettings.isAdvancedSettingsMenuVisible);
export const isLeftHalfPairing = createSelector(advanceSettingsState, fromAdvancedSettings.isLeftHalfPairing);
export const getIsI2cDebuggingEnabled = createSelector(advanceSettingsState, fromAdvancedSettings.isI2cDebuggingEnabled);
export const isI2cDebuggingRingBellEnabled = createSelector(advanceSettingsState, fromAdvancedSettings.isI2cDebuggingRingBellEnabled);

export const userConfigState = (state: AppState) => state.userConfiguration;
export const getRouterState = (state: AppState) => state.router;

export const getNewPairedDevicesState = createSelector(userConfigState, fromUserConfig.getNewPairedDevicesState);
export const getUserConfiguration = createSelector(userConfigState, fromUserConfig.getUserConfiguration);
export const getKeymaps = createSelector(userConfigState, fromUserConfig.getKeymaps);
export const getHostConnections = createSelector(userConfigState, fromUserConfig.getHostConnections);
export const getDefaultKeymap = createSelector(userConfigState, fromUserConfig.getDefaultKeymap);
export const getSelectedKeymap = createSelector(userConfigState, fromUserConfig.getSelectedKeymap);
export const getMacros = createSelector(userConfigState, fromUserConfig.getMacros);
export const getSelectedMacro = createSelector(userConfigState, fromUserConfig.getSelectedMacro);
export const isSelectedMacroNew = createSelector(userConfigState, fromUserConfig.isSelectedMacroNew);
export const isKeymapDeletable = createSelector(userConfigState, fromUserConfig.isKeymapDeletable);
export const hasMacro = createSelector(userConfigState, fromUserConfig.hasMacro);
export const getMacroMap = createSelector(userConfigState, fromUserConfig.getMacroMap);
export const lastEditedKey = createSelector(userConfigState, fromUserConfig.lastEditedKey);
export const getOpenPopover = createSelector(userConfigState, fromUserConfig.getOpenPopover);
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
export const getSelectedModuleConfiguration = createSelector(userConfigState, fromUserConfig.getSelectedModuleConfiguration);
export const showColorPalette = createSelector(userConfigState, fromUserConfig.showColorPalette);
export const perKeyRgbPresent = createSelector(userConfigState, fromUserConfig.perKeyRgbPresent);
export const backlightingMode = createSelector(userConfigState, fromUserConfig.backlightingMode);
export const getBacklightingOptions = createSelector(userConfigState, fromUserConfig.backlightingOptions);
export const getNewerUserConfiguration = createSelector(userConfigState, fromUserConfig.getNewerUserConfiguration);
export const hasRecoverableLEDSpace = createSelector(userConfigState, fromUserConfig.hasRecoverableLEDSpace);
export const backlightingColorPalette = createSelector(userConfigState, fromUserConfig.backlightingColorPalette);
export const isBacklightingColoring = createSelector(userConfigState, fromUserConfig.isBacklightingColoring);
export const selectedBacklightingColor = createSelector(userConfigState, fromUserConfig.selectedBacklightingColor);
export const selectedBacklightingColorIndex = createSelector(userConfigState, fromUserConfig.selectedBacklightingColorIndex);
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
export const disableUpdateAgentProtection = createSelector(appState, fromApp.disableUpdateAgentProtection);
export const getErrorPanelHeight = createSelector(appState, fromApp.getErrorPanelHeight);
export const getUndoableNotification = createSelector(appState, fromApp.getUndoableNotification);
export const getHardwareConfiguration = createSelector(appState, fromApp.getHardwareConfiguration);
export const getPrevUserConfiguration = createSelector(appState, fromApp.getPrevUserConfiguration);
export const runningInElectron = createSelector(appState, fromApp.runningInElectron);
export const getKeyboardLayout = createSelector(appState, fromApp.getKeyboardLayout);
export const deviceConfigurationLoaded = createSelector(appState, fromApp.deviceConfigurationLoaded);
export const getOperatingSystem = createSelector(appState, fromSelectors.getOperatingSystem);
export const keypressCapturing = createSelector(appState, fromApp.keypressCapturing);
export const runningOnNotSupportedWindows = createSelector(appState, fromApp.runningOnNotSupportedWindows);
export const contributors = (state: AppState) => state.contributors;
export const firmwareUpgradeAllowed = createSelector(runningOnNotSupportedWindows, notSupportedOs => !notSupportedOs);
export const getEverAttemptedSavingToKeyboard = createSelector(appState, fromApp.getEverAttemptedSavingToKeyboard);
export const getUdevFileContent = createSelector(appState, fromApp.getUdevFileContent);
export const getAnimationEnabled = createSelector(appState, fromApp.getAnimationEnabled);
export const getAppTheme = createSelector(appState, fromApp.getAppTheme);
export const getUhkThemeColors = createSelector(getAppTheme, (theme): UhkThemeColors => {
    return  defaultUhkThemeColors(theme);
});
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
            return device.connectedDevice && (device.communicationInterfaceAvailable || upgradingFirmware);
        }

        return !!device.connectedDevice;
    });
export const hasDevicePermission = createSelector(deviceState, fromDevice.hasDevicePermission);
export const getHostConnectionPairState = createSelector(deviceState, fromDevice.getHostConnectionPairState);
export const getLeftHalfDetected = createSelector(deviceState, fromDevice.getLeftHalfDetected);
export const getDeviceBleAddress = createSelector(deviceState, fromDevice.getDeviceBleAddress);
export const getDevicePairedWithDongle = createSelector(deviceState, fromDevice.getDevicePairedWithDongle);
export const getMissingDeviceState = createSelector(deviceState, fromDevice.getMissingDeviceState);
export const xtermLog = createSelector(firmwareState, fromFirmware.xtermLog);
export const flashFirmwareButtonDisabled = createSelector(runningInElectron, updatingFirmware, (electron, upgradingFirmware) => !electron || upgradingFirmware);
export const getStateHardwareModules = createSelector(deviceState, fromDevice.getHardwareModules);
export const getHardwareModules = createSelector(runningInElectron, getStateHardwareModules,
    (electron, hardwareModules): HardwareModules => {
        if (electron) {
            return hardwareModules;
        }

        return {
            moduleInfos: [
                {
                    module: LEFT_HALF_MODULE,
                    info: {
                        firmwareVersion: VERSIONS.firmwareVersion,
                        moduleProtocolVersion: '',
                    }
                },
                {
                    module: LEFT_KEY_CLUSTER_MODULE,
                    info: {
                        firmwareVersion: VERSIONS.firmwareVersion,
                        moduleProtocolVersion: '',
                    }
                },
                {
                    module: RIGHT_TRACKPOINT_MODULE,
                    info: {
                        firmwareVersion: VERSIONS.firmwareVersion,
                        moduleProtocolVersion: '',
                    }
                }
            ],
            rightModuleInfo: {
                deviceProtocolVersion: VERSIONS.deviceProtocolVersion,
                hardwareConfigVersion: VERSIONS.hardwareConfigVersion,
                firmwareVersion: VERSIONS.firmwareVersion,
                firmwareGitRepo: UHK_OFFICIAL_FIRMWARE_REPO,
                firmwareGitTag: 'master',
                moduleProtocolVersion: '',
                modules: {},
                userConfigVersion: VERSIONS.userConfigVersion
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
export const getUpdateUdevRules = createSelector(deviceState, fromDevice.updateUdevRules);
export const getRecoveryPageState = createSelector(deviceState, fromDevice.getRecoveryPageState);
export const getHalvesInfo = createSelector(deviceState, fromDevice.halvesInfo);
export const isUserConfigSaving = createSelector(deviceState, fromDevice.isUserConfigSaving);
export const deviceUiState = createSelector(deviceState, fromDevice.deviceUiState);
export const getConnectedDevice = createSelector(deviceState, fromDevice.getConnectedDevice);
export const getSkipFirmwareUpgrade = createSelector(deviceState, fromDevice.getSkipFirmwareUpgrade);
export const isKeyboardLayoutChanging = createSelector(deviceState, fromDevice.isKeyboardLayoutChanging);
export const keyboardHalvesAlwaysJoined = createSelector(deviceState, fromDevice.keyboardHalvesAlwaysJoined);
export const getStatusBuffer = createSelector(deviceState, fromDevice.getStatusBuffer);
export const getParsedStatusBuffer = createSelector(getMacros, getStatusBuffer, parseStatusBuffer);
export const getUserConfigAsBuffer = createSelector(getUserConfiguration, userConfig => {
    const json = userConfig.toJsonObject();
    const config = new UserConfiguration().fromJsonObject(json);
    const uhkBuffer = new UhkBuffer();
    config.toBinary(uhkBuffer);

    return uhkBuffer;
});
export const getRgbColorSpaceUsage = createSelector(getUserConfiguration, userConfig => {
    if (!userConfig.perKeyRgbPresent) {
        return 0;
    }

    let rgbColorSpaceUsage = 0;

    for (const keymap of userConfig.keymaps) {
        for (const layer of keymap.layers) {
            for (const module of layer.modules) {
                const keyActions = module.getCompressedKeyActions()
                rgbColorSpaceUsage += keyActions.length;
            }
        }
    }

    return rgbColorSpaceUsage * 3; // 3 is the 3 byte that represent a RGB color
});
export const getUserConfigSize = createSelector(getUserConfigAsBuffer, uhkBuffer => {
    return uhkBuffer.getBufferContent().length;
});
export const getMd5HasOfUserConfig = createSelector(getUserConfigAsBuffer, uhkBuffer => {
    return createMd5Hash(uhkBuffer.getBufferContent());
});
export const getConfigSizesState = createSelector(deviceState, getUserConfigSize, getRgbColorSpaceUsage,
    (deviceStateData, userConfigSize, rgbColorSpaceUsage): ConfigSizeState => {
        return {
            allUsage: userConfigSize,
            capacity: deviceStateData.configSizes.userConfig,
            rgbColorsUsage: rgbColorSpaceUsage
        };
    });
export const getConfigSizesProgressBarState = createSelector(getConfigSizesState, perKeyRgbPresent,
    (configSizeState: ConfigSizeState, perKeyRgbPresent: boolean): UhkProgressBarState => {
        const formatNumber = new Intl.NumberFormat(undefined, {
            useGrouping: true
        }).format;

        const progressBars: Array<ProgressBar> = [
            {
                color: 'var(--color-progress-bar-progress)',
                currentValue: configSizeState.allUsage - configSizeState.rgbColorsUsage,
                maxValue: configSizeState.capacity,
                minValue: 0
            }
        ];
        const legends: Array<ProgressBarLegend> = [
            {
                color: 'var(--color-progress-bar-progress)',
                text: 'keymaps and macros'
            },
            {
                color: 'var(--color-progress-bar-bg)',
                text: 'free space\n'
            }
        ];

        if (perKeyRgbPresent) {
            progressBars.unshift({
                color: 'var(--color-progress-bar-progress-rgb-colors)',
                currentValue: configSizeState.rgbColorsUsage,
                maxValue: configSizeState.capacity,
                minValue: 0
            });

            legends.unshift({
                color: 'var(--color-progress-bar-progress-rgb-colors)',
                text: 'per-key colors'
            });
        }

        return {
            legends,
            progressBars,
            text: `${formatNumber(configSizeState.allUsage)} of ${formatNumber(configSizeState.capacity)} bytes on-board storage in used`
        };
    });

export const getOutOfSpaceWarningType = createSelector(backlightingMode, hasRecoverableLEDSpace,
    (backlightingMode: BacklightingMode, hasRecoverableLEDSpace: boolean): OutOfSpaceWarningType => {
        if (hasRecoverableLEDSpace) {
            return OutOfSpaceWarningType.RecoverableLEDSpace;
        }

        if (backlightingMode === BacklightingMode.PerKeyBacklighting) {
            return OutOfSpaceWarningType.PerKeyBacklighting;
        }

        return OutOfSpaceWarningType.OutOfSpace;
    });
export const getOutOfSpaceWaringData = createSelector(getConfigSizesState, getOutOfSpaceWarningType,
    (configSizeState: ConfigSizeState, outOfSpaceWarningType): OutOfSpaceWarningData => ({
        type: outOfSpaceWarningType,
        currentValue: configSizeState.allUsage,
        maxValue: configSizeState.capacity,
        show: configSizeState.allUsage > configSizeState.capacity
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
export const getEraseBleSettingsButtonStateSelector = createSelector(deviceState, fromDevice.getEraseBleSettingsButtonState);
export const firstAttemptOfSaveToKeyboard = createSelector(
    runningInElectron,
    getEverAttemptedSavingToKeyboard,
    saveToKeyboardState,
    (electron, everAttemptedSavingToKeyboard, saveToKeyboard): boolean => {
        return electron ? !everAttemptedSavingToKeyboard && saveToKeyboard.showButton : false;
    });
export const getPrivilegePageState = createSelector(
    appState, getUdevFileContent, getUpdateUdevRules,
    (app, udevFileContent, updateUdevRules): PrivilagePageSate => {
        const permissionSetupFailed = !!app.permissionError;

        return {
            permissionSetupFailed,
            udevFileContent,
            updateUdevRules,
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
    getNewerUserConfiguration,
    (uiState, deviceConfigLoaded, disableUpdateAgentProtection, newerUserConfiguration): DeviceUiStates | undefined => {
        if (uiState) {
            return uiState;
        }

        if (newerUserConfiguration) {
            if (disableUpdateAgentProtection) {
                return;
            }

            return DeviceUiStates.UpdateNeeded;
        }

        if (!deviceConfigLoaded) {
            return DeviceUiStates.Loading;
        }
    }
);

export const getDongleState = (state: AppState) => state.dongle;
export const isDonglePairing = createSelector(getDongleState, fromDongle.isDonglePairing);
export const getDongle = createSelector(getDongleState, fromDongle.getDongle);
export const getDonglePairingState = createSelector(
    runningInElectron,
    getDongleState,
    getUserConfiguration,
    deviceConfigurationLoaded,
    getDevicePairedWithDongle,
    getConnectedDevice,
    (isRunningInElectron,
        dongleState,
        userConfig,
        deviceConfigLoaded,
        devicePairedWithDongle,
        connectedDevice,
    ): DonglePairingState => {
        if (!isRunningInElectron || !connectedDevice?.id || connectedDevice.id !== UHK_80_DEVICE.id ||
            dongleState.operation === DongleOperations.Delete
        ) {
            return {
                operation: dongleState.operation,
                state: DonglePairingStates.Idle,
                showDonglePairingPanel: false,
            };
        }

        const isDongleBleMissingFromHostConnections = dongleState.dongle?.bleAddress
            && !userConfig.hostConnections.some(hostConnection => {
                return hostConnection.type === HostConnections.Dongle && hostConnection.address === dongleState.dongle.bleAddress;
            });

        const isBleAddressMismatches = dongleState.dongle?.bleAddress && (!devicePairedWithDongle || !dongleState.dongle.isPairedWithKeyboard);

        return {
            operation: dongleState.operation,
            state: dongleState.state === DonglePairingStates.DeletingSuccess
                ? DonglePairingStates.Idle
                : dongleState.state,
            showDonglePairingPanel: deviceConfigLoaded && (isDongleBleMissingFromHostConnections || isBleAddressMismatches || dongleState.operation === DongleOperations.Pairing),
        };
    }
);

export const getEraseBleSettingsButtonState = createSelector(
    getEraseBleSettingsButtonStateSelector,
    isDonglePairing,
    (eraseBleSettings, donglePairing): EraseBleSettingsButtonState => {
        return {
            ...eraseBleSettings,
            disabled: eraseBleSettings.disabled || donglePairing,
        };
    }
);

export const getSideMenuPageState = createSelector(
    runningInElectron,
    updatingFirmware,
    getUserConfiguration,
    getRestoreUserConfiguration,
    calculateDeviceUiState,
    getConnectedDevice,
    getIsAdvancedSettingsMenuVisible,
    getSelectedLayerOption,
    getDonglePairingState,
    isLeftHalfPairing,
    getRouterState,
    getSelectedKeymap,
    (
        runningInElectronValue: boolean,
        updatingFirmwareValue: boolean,
        userConfiguration: UserConfiguration,
        restoreUserConfiguration: boolean,
        uiState,
        connectedDevice,
        isAdvancedSettingsMenuVisible,
        selectedLayerOption,
        donglePairingState,
        leftHalfPairing,
        routerState,
        selectedKeymap
    ): SideMenuPageState => {
        const macros = getMacroMenuItems(userConfiguration);

        return {
            advancedSettingsMenuVisible: isAdvancedSettingsMenuVisible,
            connectedDevice: runningInElectronValue ? connectedDevice : UHK_60_DEVICE,
            runInElectron: runningInElectronValue,
            updatingFirmware: updatingFirmwareValue || donglePairingState.operation !== DongleOperations.None || leftHalfPairing,
            deviceName: userConfiguration.deviceName,
            keymaps: userConfiguration.keymaps,
            keymapQueryParams: {
                layer: selectedLayerOption.id
            },
            macros,
            maxMacroCountReached: macros.length >= Constants.MAX_ALLOWED_MACROS,
            restoreUserConfiguration,
            deviceUiState: runningInElectronValue ? uiState : DeviceUiStates.UserConfigLoaded,
            selectedKeymap: routerState?.state?.url?.startsWith('/keymap') ? selectedKeymap : undefined,
        };
    }
);

export const maxMacroCountReached = createSelector(getSideMenuPageState, sideMenuState => sideMenuState.maxMacroCountReached);

export const macroPlaybackSupported = createSelector(getHardwareModules, (hardwareModules: HardwareModules): boolean => {
    return isVersionGte(hardwareModules.rightModuleInfo.firmwareVersion, '8.4.3');
});
export const layerDoubleTapSupported = createSelector(
    getHardwareModules,
    (hardwareModules: HardwareModules): boolean => {
        return isVersionGte(hardwareModules.rightModuleInfo.firmwareVersion, '8.4.3');
    }
);

export const extraLEDCharactersSupported = createSelector(getHardwareModules, (hardwareModules: HardwareModules): boolean => {
    return isVersionGte(hardwareModules.rightModuleInfo.userConfigVersion, '4.2.0');
});

export const isMacroCommandSupported = createSelector(getHardwareModules, (hardwareModules: HardwareModules): boolean => {
    return isVersionGte(hardwareModules.rightModuleInfo.userConfigVersion, '5.0.0');
});

export const getShowFirmwareUpgradePanel = createSelector(
    runningInElectron, getHardwareModules, getSkipFirmwareUpgrade,
    (inElectron: boolean, hardwareModules:HardwareModules, skipFirmwareUpgrade: boolean): boolean => {
        return inElectron
            && skipFirmwareUpgrade
            && hardwareModules.rightModuleInfo.userConfigVersion
            && gt(VERSIONS.userConfigVersion, hardwareModules.rightModuleInfo.userConfigVersion);
    });

export const getUserConfigHistoryState = (state: AppState) => state.userConfigurationHistory;
export const getUserConfigHistoryComponentState = createSelector(
    runningInElectron,
    getHardwareConfiguration,
    getUserConfigHistoryState,
    getUserConfiguration,
    getMd5HasOfUserConfig,
    isUserConfigSaving,
    (inElectron,
        hardwareConfig: HardwareConfiguration,
        state: fromUserConfigHistory.State,
        userConfig: UserConfiguration,
        md5Hash: string,
        saving: boolean): UserConfigHistoryComponentState => {
        let foundFirstCurrent = false;

        function fileMapper(file: CommonHistoryFileInfo): HistoryFileInfo {
            const showRestore = file.md5Hash !== md5Hash;
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
                timestamp: file.timestamp,
                displayText,
                showRestore,
                file: file.filePath
            };
        }

        const result: UserConfigHistoryComponentState = {
            deleting: inElectron && state.deleting,
            selectedTabIndex: state.activeTabIndex || 0,
            commonFiles: state.userConfigHistory.commonFiles.map(fileMapper),
            loading: inElectron && state.loading,
            tabs: state.userConfigHistory.devices.map(device => {
                return {
                    deviceUniqueId: device.uniqueId,
                    displayText: `${device.deviceName} (${device.device.name})`,
                    files: device.files.map(fileMapper),
                    isCurrentDevice: device.uniqueId === hardwareConfig?.uniqueId,
                    tooltip: `serial number: ${device.uniqueId}`,
                };
            }),
            disabled: saving
        };

        const currentDeviceHasHistory = state.userConfigHistory.devices.find(device => device.uniqueId === hardwareConfig?.uniqueId);

        if (result.tabs.length === 0 || !currentDeviceHasHistory) {
            let deviceName = UHK_60_V2_DEVICE.name;
            let tooltip = '';
            if (hardwareConfig) {
                tooltip = `serial number: ${hardwareConfig.uniqueId}`;

                const uhkDevice = UHK_DEVICES.find(device => device.id === hardwareConfig.deviceId);
                deviceName = uhkDevice ? uhkDevice.name : deviceName;
            }

            result.tabs.push({
                deviceUniqueId: -1,
                displayText: `${userConfig.deviceName} (${deviceName})`,
                files: [],
                isCurrentDevice: true,
                tooltip,
            });
        }

        result.tabs.sort((a, b) => a.displayText.localeCompare(b.displayText));

        if (state.activeTabIndex === null) {
            for (const [index, tab] of result.tabs.entries()) {
                if (tab.isCurrentDevice) {
                    result.selectedTabIndex = index;
                }
            }
        }

        return result;
    });

export const getSupportedThemes = (): AppThemeSelect[] => {
    return [
        { id: AppTheme.System, text: 'Follow operating system theme' },
        { id: AppTheme.Light, text: 'Light' },
        { id: AppTheme.Dark, text: 'Dark' }
    ];
};

export const getStateFirmwareUpgradeState = createSelector(firmwareState, fromFirmware.firmwareUpgradeState);
export const getFirmwareUpgradeState = createSelector(runningInElectron, getStateFirmwareUpgradeState,
    (electron, firmwareUpgrade): FirmwareUpgradeState => {
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
                    currentFirmwareChecksum: '',
                    currentFirmwareVersion: VERSIONS.firmwareVersion,
                    forceUpgraded: false,
                    newFirmwareVersion: undefined,
                    state: ModuleFirmwareUpgradeStates.Idle
                },
                {
                    moduleName: 'Left keyboard half',
                    firmwareUpgradeSupported: true,
                    gitRepo: UHK_OFFICIAL_FIRMWARE_REPO,
                    isOfficialFirmware: true,
                    currentFirmwareChecksum: '',
                    currentFirmwareVersion: VERSIONS.firmwareVersion,
                    forceUpgraded: false,
                    newFirmwareVersion: undefined,
                    state: ModuleFirmwareUpgradeStates.Idle
                }
            ],
            recoveryModules: []
        };
    });
export const upgradeAgentTooltip = createSelector(
    getNewerUserConfiguration,
    (newUserConfiguration) => {
        if (!newUserConfiguration) {
            return '';
        }

        return `rightModule.userConfigVersion ${newUserConfiguration.newUserConfigurationVersion} minor version is larger than agent.userConfigVersion ${VERSIONS.userConfigVersion}`;
    });
export const upgradeFirmwareTooltip = createSelector(
    getHardwareModules,
    (hardwareModules:HardwareModules) => {
        return `rightModule.userConfigVersion ${hardwareModules.rightModuleInfo.userConfigVersion} patch version is less than agent.userConfigVersion ${VERSIONS.userConfigVersion}`;
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
    runningInElectron, smartMacroDocState,
    (isRunningInElectron, smartMacroState) => {
        if (isRunningInElectron) {
            if (smartMacroState.firmwareDocState === fromSmartMacroDoc.FirmwareDocState.Loaded)
                return `http://127.0.0.1:${smartMacroState.port}/${smartMacroState.firmwareDocRepoInfo.firmwareGitRepo}/${smartMacroState.firmwareDocRepoInfo.firmwareGitTag}/index.html`;

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
    backlightingColorPalette,
    keyboardHalvesAlwaysJoined,
    (updateSettingsState,
        app,
        smartMacroPanelWidth,
        backlightingColorPalette,
        keyboardHalvesAlwaysJoined,
    ): ApplicationSettings => {
        return {
            errorPanelHeight: app.errorPanelHeight,
            checkForUpdateOnStartUp: updateSettingsState.checkForUpdateOnStartUp,
            everAttemptedSavingToKeyboard: app.everAttemptedSavingToKeyboard,
            animationEnabled: app.animationEnabled,
            appTheme: app.appTheme,
            backlightingColorPalette,
            keyboardHalvesAlwaysJoined,
            smartMacroPanelWidth
        };
    });
