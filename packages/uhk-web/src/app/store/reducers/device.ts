import { Action } from '@ngrx/store';

import { ActionTypes } from '../actions/device';

export interface State {
    connected: boolean;
    hasPermission: boolean;
    showSaveToKeyboardButton: boolean;
    savingToKeyboard: boolean;
}

const initialState: State = {
    connected: true,
    hasPermission: true,
    showSaveToKeyboardButton: false,
    savingToKeyboard: false
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connected: action.payload
            };

        case ActionTypes.PERMISSION_STATE_CHANGED:
            return {
                ...state,
                hasPermission: action.payload
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
                showSaveToKeyboardButton: true,
                savingToKeyboard: false
            };
        }

        case ActionTypes.SAVE_TO_KEYBOARD_SUCCESS: {
            return {
                ...state,
                showSaveToKeyboardButton: false,
                savingToKeyboard: false
            };
        }

        case ActionTypes.SAVE_TO_KEYBOARD_FAILED: {
            return {
                ...state,
                savingToKeyboard: false
            };
        }

        default:
            return state;
    }
}

export const isDeviceConnected = (state: State) => state.connected;
export const hasDevicePermission = (state: State) => state.hasPermission;
export const showSaveToKeyboardButton = (state: State) => state.showSaveToKeyboardButton;
export const savingToKeyboard = (state: State) => state.savingToKeyboard;
