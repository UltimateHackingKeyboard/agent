import { Action } from '@ngrx/store';
import {
    BackupUserConfiguration,
    BackupUserConfigurationInfo,
    ConfigSizesInfo,
    defaultHardwareModules,
    Dongle,
    getDefaultHalvesInfo,
    HalvesInfo,
    HardwareModules,
    isVersionGte,
    isVersionGtMinor,
    LeftSlotModules,
    RightSlotModules,
    UdevRulesInfo,
    UHK_DEVICE_IDS,
    UHK_DEVICE_IDS_TYPE,
    UhkDeviceProduct,
    VERSIONS,
} from 'uhk-common';
import { DeviceUiStates, EraseBleSettingsButtonState, RecoverPageState } from '../../models';
import { MissingDeviceState } from '../../models/missing-device-state';
import { RestoreConfigurationState } from '../../models/restore-configuration-state';

import * as App from '../actions/app';
import * as Device from '../actions/device';
import { ReadConfigSizesReplyAction } from '../actions/device';
import { getSaveToKeyboardButtonState, initProgressButtonState, ProgressButtonState } from './progress-button-state';

export interface State {
    bleAddress?: string;
    bleDeviceConnected: boolean;
    dongle?: Dongle;
    isKeyboardLayoutChanging: boolean;
    isPairedWithDongle?: boolean;
    connectedDevice?: UhkDeviceProduct;
    hasPermission: boolean;
    bootloaderActive: boolean;
    deviceConnectionStateLoaded: boolean;
    hostConnectionPairState: Record<string, boolean>;
    isErasingBleSettings: boolean;
    keyboardHalvesAlwaysJoined: boolean;
    leftHalfBootloaderActive: boolean;
    leftHalfDetected: boolean;
    multiDevice: boolean;
    communicationInterfaceAvailable: boolean;
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
    statusBuffer: string;
    udevRuleInfo: UdevRulesInfo;
}

export const initialState: State = {
    bleDeviceConnected: false,
    isKeyboardLayoutChanging: false,
    hasPermission: true,
    bootloaderActive: false,
    deviceConnectionStateLoaded: false,
    hostConnectionPairState: {},
    isErasingBleSettings: false,
    keyboardHalvesAlwaysJoined: false,
    leftHalfBootloaderActive: false,
    leftHalfDetected: false,
    multiDevice: false,
    communicationInterfaceAvailable: true,
    saveToKeyboard: initProgressButtonState,
    modifiedConfigWhileSaved: false,
    savingToKeyboard: false,
    modules: defaultHardwareModules(),
    restoringUserConfiguration: false,
    backupUserConfiguration: {
        info: BackupUserConfigurationInfo.Unknown
    },
    restoreUserConfiguration: false,
    halvesInfo: getDefaultHalvesInfo(),
    readingConfigSizes: false,
    configSizes: { userConfig: 32704, hardwareConfig: 64 },
    skipFirmwareUpgrade: false,
    statusBuffer: '',
    udevRuleInfo: UdevRulesInfo.Ok,
};

export function reducer(state = initialState, action: Action): State {

    switch (action.type) {

        case App.ActionTypes.LoadApplicationSettingsSuccess: {
            const settings = (action as App.LoadApplicationSettingsSuccessAction).payload;

            return {
                ...state,
                keyboardHalvesAlwaysJoined: settings.keyboardHalvesAlwaysJoined,
            };
        }

        case App.ActionTypes.ToggleKeyboardHalvesAlwaysJoined: {
            return {
                ...state,
                keyboardHalvesAlwaysJoined: (action as App.ToggleKeyboardHalvesAlwaysJoinedAction).payload,
            };
        }

        case Device.ActionTypes.ChangeKeyboardLayout: {
            return {
                ...state,
                isKeyboardLayoutChanging: true,
            };
        }

        case Device.ActionTypes.ChangeKeyboardLayoutReply: {
            return {
                ...state,
                isKeyboardLayoutChanging: false,
            };
        }

        case Device.ActionTypes.ConnectionStateChanged: {
            const data = (<Device.ConnectionStateChangedAction>action).payload;
            return {
                ...state,
                bleAddress: data.bleAddress,
                bleDeviceConnected: data.bleDeviceConnected,
                dongle: data.dongle,
                isPairedWithDongle: data.isPairedWithDongle,
                connectedDevice: data.connectedDevice,
                deviceConnectionStateLoaded: true,
                hasPermission: data.hasPermission,
                communicationInterfaceAvailable: data.communicationInterfaceAvailable,
                bootloaderActive: data.bootloaderActive,
                halvesInfo: data.halvesInfo,
                leftHalfBootloaderActive: data.leftHalfBootloaderActive,
                leftHalfDetected: data.leftHalfDetected,
                modules: data.hardwareModules || defaultHardwareModules(),
                multiDevice: data.multiDevice,
                udevRuleInfo: data.udevRulesInfo,
            };
        }

        case Device.ActionTypes.EraseBleSettings: {
            return {
                ...state,
                isErasingBleSettings: true
            };
        }

        case Device.ActionTypes.CheckAreHostConnectionsPairedReply: {
            const response = (<Device.CheckAreHostConnectionsPairedReplyAction>action).payload;

            return {
                ...state,
                hostConnectionPairState: response.addresses,
                isErasingBleSettings: false,
            };
        }

        case Device.ActionTypes.EraseBleSettingsReply: {
            const response = (<Device.EraseBleSettingReplyAction>action).payload;

            // After the deletion Agent queries the host connections,
            // so the CheckAreHostConnectionsPairedReply action will set the isErasingBleSettings
            if (response.success) {
                return state;
            }

            return {
                ...state,
                isErasingBleSettings: false
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

        case Device.ActionTypes.StatusBufferChanged: {
            return {
                ...state,
                statusBuffer: (<Device.StatusBufferChangedAction>action).payload
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

        case Device.ActionTypes.UpdateFirmwareSuccess: {
            const payload = (action as Device.UpdateFirmwareSuccessAction).payload;

            const newState = {
                ...state,
                saveToKeyboard: state.modifiedConfigWhileSaved && !payload.userConfigSaved
                    ? getSaveToKeyboardButtonState()
                    : initProgressButtonState,
                skipFirmwareUpgrade: payload.firmwareDowngraded
            };

            if (state.restoreUserConfiguration && payload.userConfigSaved) {
                newState.restoreUserConfiguration = false;
            }

            return newState;
        }

        case Device.ActionTypes.UpdateFirmwareFailed:
            return {
                ...state,
                modules: (action as Device.UpdateFirmwareFailedAction).payload.modules || defaultHardwareModules(),
            };

        case Device.ActionTypes.ModulesInfoLoaded:
            return {
                ...state,
                modules: (action as Device.HardwareModulesLoadedAction).payload || defaultHardwareModules(),
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

export const hasDevicePermission = (state: State) => state.hasPermission && state.udevRuleInfo === UdevRulesInfo.Ok;
export const getDeviceBleAddress = (state: State): string => state.bleAddress;
export const getDevicePairedWithDongle = (state: State): boolean => state.isPairedWithDongle;
export const getMissingDeviceState = (state: State): MissingDeviceState => {
    if (!state.deviceConnectionStateLoaded) {
        return {
            header: 'Searching for your UHK',
            subtitle: 'Hang tight!'
        };
    }

    if (!state.connectedDevice) {
        if (state.bleDeviceConnected) {
            return {
                header: 'UHK 80 connected via BLE',
                subtitle: 'Disconnect BLE and connect your UHK via its right USB port!'
            };
        }

        if (state.dongle?.serialNumber) {
            return {
                header: 'Dongle connected',
                subtitle: 'Please connect the UHK right half via USB cable!'
            };
        }

        if (state.leftHalfDetected) {
            return {
                header: 'UHK 80 left half connected',
                subtitle: 'Please connect the right half instead!'
            };
        }
    }

    if (state.connectedDevice && !state.communicationInterfaceAvailable) {
        return {
            header: 'Cannot find your UHK',
            subtitle: 'Please reconnect it!'
        };
    }

    return {
        description: 'If you have a UHK 80, connect its right half via USB, and ensure it\'s not connected to a dongle or BLE host!',
        header: 'Cannot find your UHK',
        subtitle: 'Please plug it in!'
    };
};
export const getSaveToKeyboardState = (state: State) => state.saveToKeyboard;
export const getEraseBleSettingsButtonState = (state: State): EraseBleSettingsButtonState => {
    return {
        disabled: state.isErasingBleSettings,
        erasing: state.isErasingBleSettings,
        visible: isVersionGte(state.modules.rightModuleInfo.deviceProtocolVersion, '4.14.0')
    };
};
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
export const bootloaderActive = (state: State) => state.bootloaderActive  || state.leftHalfBootloaderActive || state.dongle?.bootloaderActive;
export const halvesInfo = (state: State): HalvesInfo => {
    return {
        ...state.halvesInfo,
        areHalvesMerged: state.keyboardHalvesAlwaysJoined &&
            state.halvesInfo.leftModuleSlot === LeftSlotModules.NoModule &&
            state.halvesInfo.rightModuleSlot === RightSlotModules.NoModule
            ? true
            : state.halvesInfo.areHalvesMerged
    };
};
export const isUserConfigSaving = (state: State): boolean => state.saveToKeyboard.showProgress;
export const deviceUiState = (state: State): DeviceUiStates | undefined => {
    if (state.multiDevice) {
        return DeviceUiStates.MultiDevice;
    }

    if (!state.hasPermission) {
        return DeviceUiStates.PermissionRequired;
    }

    if (bootloaderActive(state)) {
        return DeviceUiStates.Recovery;
    }

    if (!state.connectedDevice) {
        return DeviceUiStates.NotFound;
    }

    if (state.modules.rightModuleInfo.userConfigVersion
        && isVersionGtMinor(state.modules.rightModuleInfo.userConfigVersion, VERSIONS.userConfigVersion)) {
        return DeviceUiStates.UpdateNeeded;
    }
};

export const getConnectedDevice = (state: State) => state.connectedDevice;
export const getHostConnectionPairState = (state: State): Record<string, boolean> => state.hostConnectionPairState;
export const getLeftHalfDetected = (state: State) => state.leftHalfDetected;
export const getSkipFirmwareUpgrade = (state: State) => state.skipFirmwareUpgrade;
export const isKeyboardLayoutChanging = (state: State) => state.isKeyboardLayoutChanging;
export const keyboardHalvesAlwaysJoined = (state: State) => state.keyboardHalvesAlwaysJoined;
export const getStatusBuffer = (state: State) => state.statusBuffer;
export const updateUdevRules = (state: State) => state.udevRuleInfo === UdevRulesInfo.Different;
export const getRecoveryPageState = (state: State): RecoverPageState => {
    let deviceText = 'UHK Device';
    let deviceId: UHK_DEVICE_IDS_TYPE;

    if (state.dongle?.bootloaderActive) {
        deviceText = 'UHK Dongle';
        deviceId = UHK_DEVICE_IDS.UHK_DONGLE;
    }
    else if (state.bootloaderActive) {
        deviceId = state.connectedDevice.id;

        switch (deviceId) {
            case UHK_DEVICE_IDS.UHK60V1_RIGHT:
            case UHK_DEVICE_IDS.UHK60V2_RIGHT: {
                deviceText = 'UHK 60';
                break;
            }

            case UHK_DEVICE_IDS.UHK80_RIGHT: {
                deviceText = 'UHK 80 right half';
                break;
            }
        }
    }
    else if (state.leftHalfBootloaderActive) {
        deviceText = 'UHK 80 left half';
        deviceId = UHK_DEVICE_IDS.UHK80_LEFT;
    }

    return {
        deviceId,
        description: `Your  ${deviceText} seems to be broken. No worries, Agent can fix it.`,
        title: `Fix ${deviceText}`,
    };
};
