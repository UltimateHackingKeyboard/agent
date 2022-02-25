import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { gt } from 'semver';

import {
    ApplicationSettings,
    AppTheme,
    AppThemeSelect,
    createMd5Hash,
    getMd5HashFromFilename,
    HardwareModules,
    LEFT_HALF_MODULE,
    PlayMacroAction,
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
import { isVersionGte } from '../util';
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
export const disableUpdateAgentPage = createSelector(appState, fromApp.disableUpdateAgentPage);
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
                }
            ],
            rightModuleInfo: {
                deviceProtocolVersion: agentVersionInfo.deviceProtocolVersion,
                hardwareConfigVersion: agentVersionInfo.hardwareConfigVersion,
                firmwareVersion: agentVersionInfo.firmwareVersion,
                moduleProtocolVersion: agentVersionInfo.moduleProtocolVersion,
                userConfigVersion: agentVersionInfo.userConfigVersion
            }
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
    disableUpdateAgentPage,
    (uiState, deviceConfigLoaded, isDisableUpdateAgentPage): DeviceUiStates | undefined => {
        if (uiState) {

            if(isDisableUpdateAgentPage && uiState === DeviceUiStates.UpdateNeeded)
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
        return {
            connectedDevice: runningInElectronValue ? connectedDevice : UHK_60_DEVICE,
            showAddonMenu: showAddonMenuValue,
            runInElectron: runningInElectronValue,
            updatingFirmware: updatingFirmwareValue,
            deviceName: userConfiguration.deviceName,
            keymaps: userConfiguration.keymaps,
            macros: getMacroMenuItems(userConfiguration),
            restoreUserConfiguration,
            deviceUiState: runningInElectronValue ? uiState : DeviceUiStates.UserConfigLoaded
        };
    }
);

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
                    currentFirmwareVersion: agentVersionInfo.firmwareVersion,
                    newFirmwareVersion: undefined,
                    state: ModuleFirmwareUpgradeStates.Idle
                },
                {
                    moduleName: 'Left keyboard half',
                    firmwareUpgradeSupported: true,
                    currentFirmwareVersion: agentVersionInfo.firmwareVersion,
                    newFirmwareVersion: undefined,
                    state: ModuleFirmwareUpgradeStates.Idle
                }
            ],
            recoveryModules: []
        };
    });

export const defaultUserConfigState = (state: AppState) => state.defaultUserConfiguration;
export const getDefaultUserConfigurationKeymaps = createSelector(
    defaultUserConfigState, fromDefaultUserConfig.getDefaultUserConfigurationKeymaps);
export const getSelectedAddKeymap = createSelector(
    defaultUserConfigState, fromDefaultUserConfig.getSelectedKeymap);

export const smartMacroDocState = (state: AppState) => state.smartMacroDoc;
export const getSmartMacroDocUrl = createSelector(smartMacroDocState, fromSmartMacroDoc.getSmartMacroDocUrl);
export const selectSmartMacroDocUrl = createSelector(
    runningInElectron, getSmartMacroDocUrl,
    (isRunningInElectron, smartMacroDocUrl) => {
        if (isRunningInElectron) {
            return smartMacroDocUrl;
        }

        // Base64 encoded version of the lorem-ipsum.html
        return 'data:text/html;base64,PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8dGl0bGU+U21hcnQgTWFjcm8gTG9yZW0gSXBzdW08L3RpdGxlPgogICAgPHN0eWxlPgogICAgICAgIGNvZGUgewogICAgICAgICAgICBkaXNwbGF5OiBibG9jazsKICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41cmVtOwogICAgICAgIH0KICAgIDwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+Cjxjb2RlPgogICAgc2V0IHZhciAxCjwvY29kZT4KPGJ1dHRvbiBpZD0iYXBwZW5kTWFjcm8iPkluc2VydCBNYWNybzwvYnV0dG9uPgo8cD4KICAgIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIE5hbSBjb25zZWN0ZXR1ciwgYXJjdSBzYWdpdHRpcyBvcm5hcmUgdGVtcHVzLCBmZWxpcyBleAogICAgY29udmFsbGlzIHZlbGl0LCBzY2VsZXJpc3F1ZSB0ZW1wdXMgcXVhbSBkaWFtIGV1IGVsaXQuIFNlZCBwZWxsZW50ZXNxdWUgbmlzaSBpZCBsaWd1bGEgbHVjdHVzIGhlbmRyZXJpdC4gT3JjaSB2YXJpdXMKICAgIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIG5hc2NldHVyIHJpZGljdWx1cyBtdXMuIEV0aWFtIGlkIHZvbHV0cGF0IHR1cnBpcywgYSByaG9uY3VzCiAgICB0ZWxsdXMuIFByYWVzZW50IGxpZ3VsYSBtZXR1cywgcnV0cnVtIGV0IHNlbXBlciBuZWMsIGRpY3R1bSB2ZWwgZXN0LiBDdXJhYml0dXIgc2NlbGVyaXNxdWUgYmxhbmRpdCBsYWNpbmlhLgogICAgQ3VyYWJpdHVyIGdyYXZpZGEgc2FnaXR0aXMgbWFzc2EsIGEgZmVybWVudHVtIHB1cnVzIHVsbGFtY29ycGVyIGF0LiBDdXJhYml0dXIgc2VtcGVyIHZlaGljdWxhIG1hdHRpcy4gQ3VyYWJpdHVyIGF0CiAgICBuZXF1ZSBzaXQgYW1ldCBsZW8gZGlnbmlzc2ltIGNvbnNlY3RldHVyIHNpdCBhbWV0IGV1IHB1cnVzLiBNYWVjZW5hcyBydXRydW0gdHJpc3RpcXVlIHRvcnRvciwgbmVjIGxvYm9ydGlzIGV4Lgo8L3A+CjxwPgogICAgUXVpc3F1ZSBmZXJtZW50dW0gbWFnbmEgdmVsIHVybmEgaWFjdWxpcyBncmF2aWRhLiBFdGlhbSBlbGVpZmVuZCBncmF2aWRhIGxvcmVtLCBzaXQgYW1ldCBhdWN0b3IgbWF1cmlzIGxhY2luaWEKICAgIHZpdGFlLiBEdWlzIGNvbW1vZG8gaW4gcHVydXMgdmVsIGF1Y3Rvci4gQ3JhcyBtb2xsaXMgZGlhbSBhbGlxdWV0IGp1c3RvIGFsaXF1YW0gY3Vyc3VzLiBEb25lYyBwcmV0aXVtIHNjZWxlcmlzcXVlCiAgICBleCwgYXQgcmhvbmN1cyBqdXN0byBjb25ndWUgc2VkLiBDdXJhYml0dXIgaW4gYW50ZSBudW5jLiBOdWxsYSBsYWN1cyBvZGlvLCByaG9uY3VzIHZlbCBwdXJ1cyB2ZWwsIGludGVyZHVtIGxhY2luaWEKICAgIG1hdXJpcy4gU2VkIG5lcXVlIGxlbywgbW9sbGlzIHNlZCBkdWkgYWMsIGNvbmd1ZSBibGFuZGl0IGxhY3VzLiBGdXNjZSBkYXBpYnVzIGF1Z3VlIGxpYmVybywgdml0YWUgaWFjdWxpcyBsb3JlbQogICAgZXVpc21vZCB2aXRhZS4KPC9wPgo8cD4KICAgIFZlc3RpYnVsdW0gZnJpbmdpbGxhIGFjY3Vtc2FuIG5pYmggbmVjIGFsaXF1YW0uIFByb2luIGRpY3R1bSBhY2N1bXNhbiBvcm5hcmUuIE51bmMgY29uc2VjdGV0dXIgYXJjdSByaXN1cywgdml0YWUKICAgIGludGVyZHVtIGVyYXQgZWZmaWNpdHVyIGlkLiBNYWVjZW5hcyBldCBlbGl0IHRvcnRvci4gRHVpcyBlbGVpZmVuZCBzYWdpdHRpcyB0aW5jaWR1bnQuIFN1c3BlbmRpc3NlIGFsaXF1YW0gdWx0cmljaWVzCiAgICBjb21tb2RvLiBWZXN0aWJ1bHVtIGV1IGRpYW0gbmVjIGRpYW0gbG9ib3J0aXMgZWxlaWZlbmQgaW4gdmVsIG51bGxhLiBQcmFlc2VudCBhdCB2aXZlcnJhIGxlY3R1cywgZXUgcGVsbGVudGVzcXVlCiAgICBlcmF0LiBJbnRlZ2VyIGZpbmlidXMgcmhvbmN1cyBvcmNpLCB2aXRhZSBwdWx2aW5hciBuaWJoLiBTZWQgYWNjdW1zYW4gdmVzdGlidWx1bSBwbGFjZXJhdC4gUHJhZXNlbnQgcmhvbmN1cyB0ZWxsdXMKICAgIHF1aXMgbG9yZW0gc2FnaXR0aXMgc2NlbGVyaXNxdWUgc2l0IGFtZXQgaWQgb3JjaS4gTW9yYmkgZ3JhdmlkYSBqdXN0byBzYXBpZW4sIGVnZXQgdmVoaWN1bGEgc2VtIG1hdHRpcyBzZWQuIEludGVnZXIKICAgIGp1c3RvIGRvbG9yLCB1bGxhbWNvcnBlciBldCBqdXN0byBzaXQgYW1ldCwgZWdlc3RhcyBibGFuZGl0IG5lcXVlLiBDdXJhYml0dXIgaW4gdmVuZW5hdGlzIHJpc3VzLCBlZ2V0IGNvbmd1ZSBhcmN1LgogICAgT3JjaSB2YXJpdXMgbmF0b3F1ZSBwZW5hdGlidXMgZXQgbWFnbmlzIGRpcyBwYXJ0dXJpZW50IG1vbnRlcywgbmFzY2V0dXIgcmlkaWN1bHVzIG11cy4gTWFlY2VuYXMgbWF0dGlzIG5pc2wgZmV1Z2lhdAogICAgaWFjdWxpcyB1bHRyaWNlcy4KPC9wPgo8cD4KICAgIE51bmMgcnV0cnVtIGxpYmVybyByaXN1cywgc2VkIGludGVyZHVtIHNhcGllbiBldWlzbW9kIGF0LiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LgogICAgUHJvaW4gdmVsIHJpc3VzIG51bGxhLiBEb25lYyB2aXZlcnJhIGVyb3MgdmVsIGV4IGxvYm9ydGlzIGNvbnNlY3RldHVyLiBEb25lYyBub24gbGliZXJvIHNvZGFsZXMsIHRpbmNpZHVudCBsaWd1bGEKICAgIGlkLCBtYWxlc3VhZGEgcHVydXMuIEludGVnZXIgZmF1Y2lidXMgZXggbmVxdWUsIHZpdGFlIGZhdWNpYnVzIG1pIGVnZXN0YXMgbmVjLiBTdXNwZW5kaXNzZSBxdWlzIGZldWdpYXQgbGliZXJvLCB1dAogICAgc29kYWxlcyBlcm9zLiBQcmFlc2VudCBhYyBsYW9yZWV0IGxpZ3VsYS4KPC9wPgo8cD4KICAgIEluIGlhY3VsaXMsIGxlbyBzZWQgYmxhbmRpdCBjb25zZXF1YXQsIG5pYmggbnVsbGEgZ3JhdmlkYSBzZW0sIHZlbCBmZXVnaWF0IGVzdCBtaSB1dCBmZWxpcy4gRXRpYW0gbGFjaW5pYSBzZW0gZXQKICAgIG9kaW8gYmxhbmRpdCBjb25zZXF1YXQuIFBlbGxlbnRlc3F1ZSBtYXVyaXMgbnVuYywgc29kYWxlcyBzaXQgYW1ldCBzZW1wZXIgdWx0cmljaWVzLCBtYXhpbXVzIGVnZXQgbWV0dXMuIFByb2luCiAgICBhY2N1bXNhbiwgbGVjdHVzIGEgdGVtcG9yIGJsYW5kaXQsIG51bGxhIGxlY3R1cyBmYXVjaWJ1cyBuZXF1ZSwgbmVjIGxvYm9ydGlzIGF1Z3VlIGV4IG5vbiBuZXF1ZS4gUHJhZXNlbnQgbHVjdHVzCiAgICBmZXJtZW50dW0gbWFnbmEsIHF1aXMgbGFvcmVldCBudWxsYSBkaWduaXNzaW0gYS4gTnVuYyB2ZWhpY3VsYSBzY2VsZXJpc3F1ZSBqdXN0byBhIGVsZW1lbnR1bS4gU3VzcGVuZGlzc2UgaWQgbWF1cmlzCiAgICBzZWQgbWV0dXMgY29udmFsbGlzIGRhcGlidXMgdmVsIHNpdCBhbWV0IG5pYmguIERvbmVjIHJ1dHJ1bSBpcHN1bSB2ZWwgc29kYWxlcyBncmF2aWRhLiBTdXNwZW5kaXNzZSB2ZWwgZmVsaXMgcHVydXMuCiAgICBEb25lYyB2b2x1dHBhdCB2ZWxpdCBxdWlzIGFyY3UgZWZmaWNpdHVyLCBldCByaG9uY3VzIGxlbyBjb25ndWUuIEFlbmVhbiB2aXRhZSBlZmZpY2l0dXIgc2VtLiBOdW5jIG5vbiBwcmV0aXVtCiAgICB0dXJwaXMsIGF0IHNvZGFsZXMgdG9ydG9yLgo8L3A+Cgo8c2NyaXB0IHR5cGU9Im1vZHVsZSI+CiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwZW5kTWFjcm8nKTsKICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsKICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsKICAgICAgICAgICAgYWN0aW9uOiAnc21kLWluc2VydC1tYWNybycsCiAgICAgICAgICAgIGRhdGE6ICdzZXQgdmFyIDEnCiAgICAgICAgfSwgJyonKQogICAgfSkKCiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGV2ZW50ID0+IHsKICAgICAgICBjb25zb2xlLmxvZygnTWVzc2FnZSBhcnJpdmVkJyk7CgogICAgICAgIHN3aXRjaCAoZXZlbnQuZGF0YS5hY3Rpb24pIHsKCiAgICAgICAgICAgIGNhc2UgJ3NtYS1lZGl0b3ItZ290LWZvY3VzJzogewogICAgICAgICAgICAgICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTsKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB9CgogICAgICAgICAgICBjYXNlICdzbWEtZWRpdG9yLWxvc3QtZm9jdXMnOiB7CiAgICAgICAgICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKTsKICAgICAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgICB9CgogICAgICAgICAgICBkZWZhdWx0OiB7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0pOwogICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2VlcnJvcicsIGNvbnNvbGUuZXJyb3IpCiAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHthY3Rpb246ICdzbWQtaW5pdGVkJ30sICcqJyk7Cjwvc2NyaXB0Pgo8L2JvZHk+CjwvaHRtbD4K';
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
