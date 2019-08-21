import { Action } from '@ngrx/store';
import { HardwareModules, UdevRulesInfo, HalvesInfo } from 'uhk-common';

import * as Device from '../actions/device';
import * as App from '../actions/app';
import { initProgressButtonState, ProgressButtonState } from './progress-button-state';
import { XtermCssClass, XtermLog } from '../../models/xterm-log';
import { RestoreConfigurationState } from '../../models/restore-configuration-state';
import { MissingDeviceState } from '../../models/missing-device-state';

export interface State {
    connected: boolean;
    hasPermission: boolean;
    bootloaderActive: boolean;
    zeroInterfaceAvailable: boolean;
    udevRuleInfo: UdevRulesInfo;
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
    halvesInfo: HalvesInfo;
}

export const initialState: State = {
    connected: true,
    hasPermission: true,
    bootloaderActive: false,
    zeroInterfaceAvailable: true,
    udevRuleInfo: UdevRulesInfo.Unknown,
    saveToKeyboard: initProgressButtonState,
    savingToKeyboard: false,
    updatingFirmware: false,
    firmwareUpdateFinished: false,
    modules: {
        leftModuleInfo: {
            firmwareVersion: '',
            moduleProtocolVersion: ''
        },
        rightModuleInfo: {
            firmwareVersion: ''
        }
    },
    log: [{ message: '', cssClass: XtermCssClass.standard }],
    restoringUserConfiguration: false,
    hasBackupUserConfiguration: false,
    halvesInfo: { isLeftHalfConnected: true, areHalvesMerged: false }
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {
        case Device.ActionTypes.ConnectionStateChanged: {
            const data = (<Device.ConnectionStateChangedAction>action).payload;
            return {
                ...state,
                connected: data.connected,
                hasPermission: data.hasPermission,
                zeroInterfaceAvailable: data.zeroInterfaceAvailable,
                bootloaderActive: data.bootloaderActive,
                udevRuleInfo: data.udevRulesInfo,
                halvesInfo: data.halvesInfo
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
                    action: new Device.SaveConfigurationAction()
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
                    action: new Device.SaveConfigurationAction()
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
                hasBackupUserConfiguration: (action as Device.HasBackupUserConfigurationAction).payload
            };

        case Device.ActionTypes.RestoreConfigurationFromBackupSuccess:
            return {
                ...state,
                hasBackupUserConfiguration: false
            };

        case Device.ActionTypes.RecoveryDevice: {
            return {
                ...state,
                updatingFirmware: true,
                log: [{ message: '', cssClass: XtermCssClass.standard }]
            };
        }
        default:
            return state;
    }
}

export const updatingFirmware = (state: State) => state.updatingFirmware;
export const isDeviceConnected = (state: State) => state.connected || state.updatingFirmware;
export const hasDevicePermission = (state: State) => state.udevRuleInfo === UdevRulesInfo.Ok;
export const getMissingDeviceState = (state: State): MissingDeviceState => {
    if (state.connected && !state.zeroInterfaceAvailable) {
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
export const getHasBackupUserConfiguration = (state: State) => state.hasBackupUserConfiguration;
export const getBackupUserConfigurationState = (state: State): RestoreConfigurationState => {
    return {
        restoringUserConfiguration: state.restoringUserConfiguration,
        hasBackupUserConfiguration: state.hasBackupUserConfiguration
    };
};
export const bootloaderActive = (state: State) => state.bootloaderActive;
export const firmwareUpgradeFailed = (state: State) => state.firmwareUpdateFailed;
export const firmwareUpgradeSuccess = (state: State) => state.firmwareUpdateSuccess;
export const updateUdevRules = (state: State) => state.udevRuleInfo === UdevRulesInfo.Different;
export const halvesInfo = (state: State) => state.halvesInfo;
