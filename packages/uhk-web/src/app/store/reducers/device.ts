import { Action } from '@ngrx/store';

import {
    ActionTypes,
    ConnectionStateChangedAction,
    PermissionStateChangedAction,
    SaveConfigurationAction, UpdateFirmwareFailedAction
} from '../actions/device';
import { ActionTypes as AppActions, ElectronMainLogReceivedAction } from '../actions/app';
import { initProgressButtonState, ProgressButtonState } from './progress-button-state';
import { XtermCssClass, XtermLog } from '../../models/xterm-log';

export interface State {
    connected: boolean;
    hasPermission: boolean;
    saveToKeyboard: ProgressButtonState;
    updatingFirmware: boolean;
    firmwareUpdateFinished: boolean;
    log: Array<XtermLog>;
}

export const initialState: State = {
    connected: true,
    hasPermission: true,
    saveToKeyboard: initProgressButtonState,
    updatingFirmware: false,
    firmwareUpdateFinished: false,
    log: [{message: '', cssClass: XtermCssClass.standard}]
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connected: (<ConnectionStateChangedAction>action).payload
            };

        case ActionTypes.PERMISSION_STATE_CHANGED:
            return {
                ...state,
                hasPermission: (<PermissionStateChangedAction>action).payload
            };

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
                }
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
                firmwareUpdateFinished: true
            };

        case ActionTypes.UPDATE_FIRMWARE_FAILED: {
            const logEntry = {
                message: (action as UpdateFirmwareFailedAction).payload.message,
                cssClass: XtermCssClass.error
            };

            return {
                ...state,
                updatingFirmware: false,
                firmwareUpdateFinished: true,
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
        default:
            return state;
    }
}

export const updatingFirmware = (state: State) => state.updatingFirmware;
export const isDeviceConnected = (state: State) => state.hasPermission && (state.connected || state.updatingFirmware);
export const hasDevicePermission = (state: State) => state.hasPermission;
export const getSaveToKeyboardState = (state: State) => state.saveToKeyboard;
export const xtermLog = (state: State) => state.log;
export const firmwareOkButtonDisabled = (state: State) => !state.firmwareUpdateFinished;
