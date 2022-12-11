import { Action } from '@ngrx/store';
import {
    BackupUserConfiguration,
    BackupUserConfigurationInfo,
    ConfigSizesInfo,
    getDefaultHalvesInfo,
    HalvesInfo,
    HardwareModules,
    isVersionGtMinor,
    UhkDeviceProduct
} from 'uhk-common';
import { DeviceUiStates } from '../../models';
import { MissingDeviceState } from '../../models/missing-device-state';
import { RestoreConfigurationState } from '../../models/restore-configuration-state';
import { getVersions } from '../../util';

import * as Device from '../actions/device';
import { ReadConfigSizesReplyAction } from '../actions/device';
import { getSaveToKeyboardButtonState, initProgressButtonState, ProgressButtonState } from './progress-button-state';

export interface State {
    connectedDevice?: UhkDeviceProduct;
    hasPermission: boolean;
    bootloaderActive: boolean;
    deviceConnectionStateLoaded: boolean;
    multiDevice: boolean;
    zeroInterfaceAvailable: boolean;
    saveToKeyboard: ProgressButtonState;
    modifiedConfigWhileSaved: boolean;
    savingToKeyboard: boolean;
    modules: HardwareModules;
    restoringUserConfiguration: boolean;
    backupUserConfiguration: BackupUserConfiguration;
    restoreUserConfiguration: boolean;
    halvesInfo: HalvesInfo;
    readingConfigSizes: boolean;
    configSizes: ConfigSizesInfo;
    skipFirmwareUpgrade: boolean;
}

export const initialState: State = {
    hasPermission: true,
    bootloaderActive: false,
    deviceConnectionStateLoaded: false,
    multiDevice: false,
    zeroInterfaceAvailable: true,
    saveToKeyboard: initProgressButtonState,
    modifiedConfigWhileSaved: false,
    savingToKeyboard: false,
    modules: {
        moduleInfos: [],
        rightModuleInfo: {
            firmwareVersion: ''
        }
    },
    restoringUserConfiguration: false,
    backupUserConfiguration: {
        info: BackupUserConfigurationInfo.Unknown
    },
    restoreUserConfiguration: false,
    halvesInfo: getDefaultHalvesInfo(),
    readingConfigSizes: false,
    configSizes: { userConfig: 32704, hardwareConfig: 64 },
    skipFirmwareUpgrade: false
};

export function reducer(state = initialState, action: Action): State {

    switch (action.type) {
        case Device.ActionTypes.ConnectionStateChanged: {
            const data = (<Device.ConnectionStateChangedAction>action).payload;
            return {
                ...state,
                connectedDevice: data.connectedDevice,
                deviceConnectionStateLoaded: true,
                hasPermission: data.hasPermission,
                zeroInterfaceAvailable: data.zeroInterfaceAvailable,
                bootloaderActive: data.bootloaderActive,
                halvesInfo: data.halvesInfo,
                modules: data.hardwareModules,
                multiDevice: data.multiDevice
            };
        }

        case Device.ActionTypes.SavingConfiguration: {
            return {
                ...state,
                savingToKeyboard: true
            };
        }

        case Device.ActionTypes.ShowSaveToKeyboardButton: {
            return {
                ...state,
                modifiedConfigWhileSaved: state.modifiedConfigWhileSaved
                    || state.saveToKeyboard.showProgress
                    || (state.saveToKeyboard.showButton && !state.saveToKeyboard.action),
                saveToKeyboard: getSaveToKeyboardButtonState()
            };
        }

        case Device.ActionTypes.SaveConfiguration: {
            if (state.skipFirmwareUpgrade)
                return state;

            return {
                ...state,
                saveToKeyboard: {
                    showButton: true,
                    text: 'Saving',
                    showProgress: true
                }
            };
        }

        case Device.ActionTypes.SaveToKeyboardSuccess: {
            return {
                ...state,
                saveToKeyboard: {
                    showButton: true,
                    text: 'Saved!',
                    action: null
                },
                restoringUserConfiguration: false
            };
        }

        case Device.ActionTypes.SaveToKeyboardFailed: {
            return {
                ...state,
                modifiedConfigWhileSaved: false,
                saveToKeyboard: getSaveToKeyboardButtonState()
            };
        }

        case Device.ActionTypes.HideSaveToKeyboardButton: {
            return {
                ...state,
                modifiedConfigWhileSaved: false,
                saveToKeyboard: state.modifiedConfigWhileSaved
                    ? getSaveToKeyboardButtonState()
                    : initProgressButtonState
            };
        }

        case Device.ActionTypes.UpdateFirmwareSuccess:
            return {
                ...state,
                modules: (action as Device.UpdateFirmwareSuccessAction).payload,
                saveToKeyboard: state.modifiedConfigWhileSaved
                    ? getSaveToKeyboardButtonState()
                    : initProgressButtonState
            };

        case Device.ActionTypes.UpdateFirmwareFailed:
            return {
                ...state,
                modules: (action as Device.UpdateFirmwareFailedAction).payload.modules
            };

        case Device.ActionTypes.ModulesInfoLoaded:
            return {
                ...state,
                modules: (action as Device.HardwareModulesLoadedAction).payload
            };

        case Device.ActionTypes.ResetUserConfiguration:
        case Device.ActionTypes.RestoreConfigurationFromBackup:
            return {
                ...state,
                restoringUserConfiguration: true
            };

        case Device.ActionTypes.BackupUserConfiguration:
            return {
                ...state,
                restoreUserConfiguration: true,
                backupUserConfiguration: (action as Device.BackupUserConfigurationAction).payload
            };

        case Device.ActionTypes.RestoreConfigurationFromBackupSuccess:
            return {
                ...state,
                restoreUserConfiguration: false,
            };

        case Device.ActionTypes.ReadConfigSizes:
            return {
                ...state,
                readingConfigSizes: true
            };

        case Device.ActionTypes.ReadConfigSizesReply:
            return {
                ...state,
                readingConfigSizes: false,
                configSizes: (action as ReadConfigSizesReplyAction).payload
            };

        case Device.ActionTypes.SkipFirmwareUpgrade:
            return {
                ...state,
                skipFirmwareUpgrade: true
            };

        default:
            return state;
    }
}

export const hasDevicePermission = (state: State) => state.hasPermission;
export const getMissingDeviceState = (state: State): MissingDeviceState => {
    if (!state.deviceConnectionStateLoaded) {
        return {
            header: 'Searching for your UHK',
            subtitle: 'Hang tight!'
        };
    }

    if (state.connectedDevice && !state.zeroInterfaceAvailable) {
        return {
            header: 'Cannot find your UHK',
            subtitle: 'Please reconnect it!'
        };
    }

    return {
        header: 'Cannot find your UHK',
        subtitle: 'Please plug it in!'
    };
};
export const getSaveToKeyboardState = (state: State) => state.saveToKeyboard;
export const getHardwareModules = (state: State) => state.modules;
export const getHasBackupUserConfiguration = (state: State) => {
    return (state.backupUserConfiguration?.info === BackupUserConfigurationInfo.LastCompatible
        || state.backupUserConfiguration?.info === BackupUserConfigurationInfo.EarlierCompatible
        || state.backupUserConfiguration?.info === BackupUserConfigurationInfo.NotExists)
        && state.restoreUserConfiguration;
};
export const getBackupUserConfigurationState = (state: State): RestoreConfigurationState => {
    return {
        restoringUserConfiguration: state.restoringUserConfiguration,
        backupUserConfiguration: state.backupUserConfiguration
    };
};
export const bootloaderActive = (state: State) => state.bootloaderActive;
export const halvesInfo = (state: State) => state.halvesInfo;
export const isUserConfigSaving = (state: State): boolean => state.saveToKeyboard.showProgress;
export const deviceUiState = (state: State): DeviceUiStates | undefined => {
    if (state.multiDevice) {
        return DeviceUiStates.MultiDevice;
    }

    if (!state.hasPermission) {
        return DeviceUiStates.PermissionRequired;
    }

    if (state.bootloaderActive) {
        return DeviceUiStates.Recovery;
    }

    if (!state.connectedDevice) {
        return DeviceUiStates.NotFound;
    }

    if (isVersionGtMinor(state.modules.rightModuleInfo.userConfigVersion, getVersions().userConfigVersion)) {
        return DeviceUiStates.UpdateNeeded;
    }
};

export const getConnectedDevice = (state: State) => state.connectedDevice;
export const getSkipFirmwareUpgrade = (state: State) => state.skipFirmwareUpgrade;
