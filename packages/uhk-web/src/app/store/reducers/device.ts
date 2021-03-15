import { Action } from '@ngrx/store';
import { ConfigSizesInfo, getDefaultHalvesInfo, HalvesInfo, HardwareModules, UhkDeviceProduct } from 'uhk-common';

import * as Device from '../actions/device';
import { ReadConfigSizesReplyAction } from '../actions/device';
import * as App from '../actions/app';
import { initProgressButtonState, ProgressButtonState } from './progress-button-state';
import { XtermCssClass, XtermLog } from '../../models/xterm-log';
import { RestoreConfigurationState } from '../../models/restore-configuration-state';
import { MissingDeviceState } from '../../models/missing-device-state';
import { DeviceUiStates } from '../../models';

export interface State {
    connectedDevice?: UhkDeviceProduct;
    hasPermission: boolean;
    bootloaderActive: boolean;
    multiDevice: boolean;
    mgmtInterfaceAvailable: boolean;
    saveToKeyboard: ProgressButtonState;
    savingToKeyboard: boolean;
    updatingFirmware: boolean;
    firmwareUpdateFinished: boolean;
    firmwareUpdateFailed?: boolean;
    firmwareUpdateSuccess?: boolean;
    modules: HardwareModules;
    log: Array<XtermLog>;
    restoringUserConfiguration: boolean;
    hasBackupUserConfiguration: boolean;
    restoreUserConfiguration: boolean;
    halvesInfo: HalvesInfo;
    readingConfigSizes: boolean;
    configSizes: ConfigSizesInfo;
}

export const initialState: State = {
    hasPermission: true,
    bootloaderActive: false,
    multiDevice: false,
    mgmtInterfaceAvailable: true,
    saveToKeyboard: initProgressButtonState,
    savingToKeyboard: false,
    updatingFirmware: false,
    firmwareUpdateFinished: false,
    modules: {
        moduleInfos: [],
        rightModuleInfo: {
            firmwareVersion: ''
        }
    },
    log: [{ message: '', cssClass: XtermCssClass.standard }],
    restoringUserConfiguration: false,
    hasBackupUserConfiguration: false,
    restoreUserConfiguration: false,
    halvesInfo: getDefaultHalvesInfo(),
    readingConfigSizes: false,
    configSizes: { userConfig: 32704, hardwareConfig: 64 }
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {
        case Device.ActionTypes.ConnectionStateChanged: {
            const data = (<Device.ConnectionStateChangedAction>action).payload;
            return {
                ...state,
                connectedDevice: data.connectedDevice,
                hasPermission: data.hasPermission,
                mgmtInterfaceAvailable: data.mgmtInterfaceAvailable,
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
                saveToKeyboard: {
                    showButton: true,
                    text: 'Save to keyboard',
                    action: new Device.SaveConfigurationAction(true)
                }
            };
        }

        case Device.ActionTypes.SaveConfiguration: {
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
                saveToKeyboard: {
                    showButton: true,
                    text: 'Save to keyboard',
                    action: new Device.SaveConfigurationAction(true)
                }
            };
        }

        case Device.ActionTypes.HideSaveToKeyboardButton: {
            return {
                ...state,
                saveToKeyboard: initProgressButtonState
            };
        }

        case Device.ActionTypes.UpdateFirmwareWith:
        case Device.ActionTypes.UpdateFirmware:
            return {
                ...state,
                updatingFirmware: true,
                firmwareUpdateFinished: false,
                firmwareUpdateFailed: false,
                firmwareUpdateSuccess: false,
                log: [{ message: 'Start flashing firmware', cssClass: XtermCssClass.standard }]
            };

        case Device.ActionTypes.UpdateFirmwareSuccess:
            return {
                ...state,
                updatingFirmware: false,
                firmwareUpdateFinished: true,
                firmwareUpdateSuccess: true,
                modules: (action as Device.UpdateFirmwareSuccessAction).payload
            };

        case Device.ActionTypes.UpdateFirmwareFailed: {
            const data = (action as Device.UpdateFirmwareFailedAction).payload;
            const logEntry = {
                message: data.error.message,
                cssClass: XtermCssClass.error
            };

            return {
                ...state,
                updatingFirmware: false,
                firmwareUpdateFinished: true,
                firmwareUpdateFailed: true,
                modules: data.modules,
                log: [...state.log, logEntry]
            };
        }

        case App.ActionTypes.ElectronMainLogReceived: {
            if (!state.updatingFirmware) {
                return state;
            }

            const payload = (action as App.ElectronMainLogReceivedAction).payload;

            if (payload.message.indexOf('UHK Device not found:') > -1) {
                return state;
            }

            const logEntry = {
                message: payload.message,
                cssClass: payload.level === 'error' ? XtermCssClass.error : XtermCssClass.standard
            };

            return {
                ...state,
                log: [...state.log, logEntry]
            };
        }

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

        case Device.ActionTypes.HasBackupUserConfiguration:
            return {
                ...state,
                restoreUserConfiguration: true,
                hasBackupUserConfiguration: (action as Device.HasBackupUserConfigurationAction).payload
            };

        case Device.ActionTypes.RestoreConfigurationFromBackupSuccess:
            return {
                ...state,
                restoreUserConfiguration: false,
                hasBackupUserConfiguration: false
            };

        case Device.ActionTypes.RecoveryDevice: {
            return {
                ...state,
                updatingFirmware: true,
                log: [{ message: '', cssClass: XtermCssClass.standard }]
            };
        }

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

        default:
            return state;
    }
}

export const updatingFirmware = (state: State) => state.updatingFirmware;
export const isDeviceConnected = (state: State) => state.connectedDevice || state.updatingFirmware;
export const hasDevicePermission = (state: State) => state.hasPermission;
export const getMissingDeviceState = (state: State): MissingDeviceState => {
    if (state.connectedDevice && !state.mgmtInterfaceAvailable) {
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
export const xtermLog = (state: State) => state.log;
export const getHardwareModules = (state: State) => state.modules;
export const getHasBackupUserConfiguration = (state: State) => state.hasBackupUserConfiguration || state.restoreUserConfiguration;
export const getBackupUserConfigurationState = (state: State): RestoreConfigurationState => {
    return {
        restoringUserConfiguration: state.restoringUserConfiguration,
        hasBackupUserConfiguration: state.hasBackupUserConfiguration
    };
};
export const bootloaderActive = (state: State) => state.bootloaderActive;
export const firmwareUpgradeFailed = (state: State) => state.firmwareUpdateFailed;
export const firmwareUpgradeSuccess = (state: State) => state.firmwareUpdateSuccess;
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
};

export const getConnectedDevice = (state: State) => state.connectedDevice;
