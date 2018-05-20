import { Action } from '@ngrx/store';
import { HardwareModules } from 'uhk-common';

import {
    ActionTypes,
    ConnectionStateChangedAction,
    HardwareModulesLoadedAction,
    SaveConfigurationAction,
    HasBackupUserConfigurationAction,
    UpdateFirmwareFailedAction
} from '../actions/device';
import { ActionTypes as AppActions, ElectronMainLogReceivedAction } from '../actions/app';
import { initProgressButtonState, ProgressButtonState } from './progress-button-state';
import { XtermCssClass, XtermLog } from '../../models/xterm-log';
import { RestoreConfigurationState } from '../../models/restore-configuration-state';

export interface State {
    connected: boolean;
    hasPermission: boolean;
    bootloaderActive: boolean;
    saveToKeyboard: ProgressButtonState;
    updatingFirmware: boolean;
    firmwareUpdateFinished: boolean;
    modules: HardwareModules;
    log: Array<XtermLog>;
    restoringUserConfiguration: boolean;
    hasBackupUserConfiguration: boolean;
}

export const initialState: State = {
    connected: true,
    hasPermission: true,
    bootloaderActive: false,
    saveToKeyboard: initProgressButtonState,
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
    log: [{message: '', cssClass: XtermCssClass.standard}],
    restoringUserConfiguration: false,
    hasBackupUserConfiguration: false
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.CONNECTION_STATE_CHANGED: {
            const data = (<ConnectionStateChangedAction>action).payload;
            return {
                ...state,
                connected: data.connected,
                hasPermission: data.hasPermission,
                bootloaderActive: data.bootloaderActive
            };
        }

        case ActionTypes.SAVING_CONFIGURATION: {
            return {
                ...state,
                savingToKeyboard: true
            };
        }

        case ActionTypes.SHOW_SAVE_TO_KEYBOARD_BUTTON: {
            return {
                ...state,
                saveToKeyboard: {
                    showButton: true,
                    text: 'Save to keyboard',
                    action: new SaveConfigurationAction()
                }
            };
        }

        case ActionTypes.SAVE_CONFIGURATION: {
            return {
                ...state,
                saveToKeyboard: {
                    showButton: true,
                    text: 'Saving',
                    showProgress: true
                }
            };
        }

        case ActionTypes.SAVE_TO_KEYBOARD_SUCCESS: {
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

        case ActionTypes.SAVE_TO_KEYBOARD_FAILED: {
            return {
                ...state,
                saveToKeyboard: {
                    showButton: true,
                    text: 'Save to keyboard',
                    action: new SaveConfigurationAction()
                }
            };
        }

        case ActionTypes.HIDE_SAVE_TO_KEYBOARD_BUTTON: {
            return {
                ...state,
                saveToKeyboard: initProgressButtonState
            };
        }

        case ActionTypes.UPDATE_FIRMWARE_WITH:
        case ActionTypes.UPDATE_FIRMWARE:
            return {
                ...state,
                updatingFirmware: true,
                firmwareUpdateFinished: false,
                log: [{message: 'Start flashing firmware', cssClass: XtermCssClass.standard}]
            };

        case ActionTypes.UPDATE_FIRMWARE_SUCCESS:
            return {
                ...state,
                updatingFirmware: false,
                firmwareUpdateFinished: true,
                modules: (action as UpdateFirmwareFailedAction).payload
            };

        case ActionTypes.UPDATE_FIRMWARE_FAILED: {
            const data = (action as UpdateFirmwareFailedAction).payload;
            const logEntry = {
                message: data.error.message,
                cssClass: XtermCssClass.error
            };

            return {
                ...state,
                updatingFirmware: false,
                firmwareUpdateFinished: true,
                modules: data.modules,
                log: [...state.log, logEntry]
            };
        }

        case AppActions.ELECTRON_MAIN_LOG_RECEIVED: {
            if (!state.updatingFirmware) {
                return state;
            }

            const payload = (action as ElectronMainLogReceivedAction).payload;

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

        case ActionTypes.MODULES_INFO_LOADED:
            return {
                ...state,
                modules: (action as HardwareModulesLoadedAction).payload
            };

        case ActionTypes.RESET_USER_CONFIGURATION:
        case ActionTypes.RESTORE_CONFIGURATION_FROM_BACKUP:
            return {
                ...state,
                restoringUserConfiguration: true
            };

        case ActionTypes.HAS_BACKUP_USER_CONFIGURATION:
            return {
                ...state,
                hasBackupUserConfiguration: (action as HasBackupUserConfigurationAction).payload
            };

        case ActionTypes.RESTORE_CONFIGURATION_FROM_BACKUP_SUCCESS:
            return {
                ...state,
                hasBackupUserConfiguration: false
            };

        case ActionTypes.RECOVERY_DEVICE: {
            return {
                ...state,
                updatingFirmware: true,
                log: [{message: '', cssClass: XtermCssClass.standard}]
            };
        }
        default:
            return state;
    }
}

export const updatingFirmware = (state: State) => state.updatingFirmware;
export const isDeviceConnected = (state: State) => state.connected || state.updatingFirmware;
export const hasDevicePermission = (state: State) => state.hasPermission;
export const getSaveToKeyboardState = (state: State) => state.saveToKeyboard;
export const xtermLog = (state: State) => state.log;
export const firmwareOkButtonDisabled = (state: State) => !state.firmwareUpdateFinished;
export const getHardwareModules = (state: State) => state.modules;
export const getHasBackupUserConfiguration = (state: State) => state.hasBackupUserConfiguration;
export const getBackupUserConfigurationState = (state: State): RestoreConfigurationState => {
    return {
        restoringUserConfiguration: state.restoringUserConfiguration,
        hasBackupUserConfiguration: state.hasBackupUserConfiguration
    };
};
export const bootloaderActive = (state: State) => state.bootloaderActive;
