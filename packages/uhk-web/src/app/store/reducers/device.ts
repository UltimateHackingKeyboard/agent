import { Action } from '@ngrx/store';

import {
    ActionTypes,
    ConnectionStateChangedAction,
    PermissionStateChangedAction,
    SaveConfigurationAction
} from '../actions/device';
import { initProgressButtonState, ProgressButtonState } from './progress-button-state';

export interface State {
    connected: boolean;
    hasPermission: boolean;
    saveToKeyboard: ProgressButtonState;
    updatingFirmware: boolean;
}

export const initialState: State = {
    connected: true,
    hasPermission: true,
    saveToKeyboard: initProgressButtonState,
    updatingFirmware: false
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
                updatingFirmware: true
            };

        case ActionTypes.UPDATE_FIRMWARE_SUCCESS:
        case ActionTypes.UPDATE_FIRMWARE_FAILED:
            return {
                ...state,
                updatingFirmware: false
            };

        default:
            return state;
    }
}

export const updatingFirmware = (state: State) => state.updatingFirmware;
export const isDeviceConnected = (state: State) => state.connected || state.updatingFirmware;
export const hasDevicePermission = (state: State) => state.hasPermission;
export const getSaveToKeyboardState = (state: State) => state.saveToKeyboard;
