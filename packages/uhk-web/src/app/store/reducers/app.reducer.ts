import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { VersionInformation } from 'uhk-common';

import { HardwareConfiguration, Notification, NotificationType, runInElectron, UserConfiguration } from 'uhk-common';
import { ActionTypes, ShowNotificationAction } from '../actions/app';
import { ActionTypes as UserConfigActionTypes } from '../actions/user-config';
import { ActionTypes as DeviceActionTypes } from '../actions/device';
import { KeyboardLayout } from '../../keyboard/keyboard-layout.enum';
import { getVersions } from '../../util';

export interface State {
    started: boolean;
    showAddonMenu: boolean;
    autoWriteUserConfiguration: boolean;
    undoableNotification?: Notification;
    navigationCountAfterNotification: number;
    prevUserConfig?: UserConfiguration;
    runningInElectron: boolean;
    configLoading: boolean;
    hardwareConfig?: HardwareConfiguration;
    agentVersionInfo?: VersionInformation;
}

export const initialState: State = {
    started: false,
    showAddonMenu: false,
    autoWriteUserConfiguration: false,
    navigationCountAfterNotification: 0,
    runningInElectron: runInElectron(),
    configLoading: true,
    agentVersionInfo: getVersions()
};

export function reducer(state = initialState, action: Action & { payload: any }) {
    switch (action.type) {
        case ActionTypes.APP_STARTED: {
            return {
                ...state,
                started: true
            };
        }

        case ActionTypes.APPLY_COMMAND_LINE_ARGS: {
            return {
                ...state,
                showAddonMenu: action.payload.addons,
                autoWriteUserConfiguration: action.payload.autoWriteConfig
            };
        }

        case ActionTypes.APP_SHOW_NOTIFICATION: {
            const currentAction = <ShowNotificationAction>action;
            if (currentAction.payload.type !== NotificationType.Undoable) {
                return state;
            }
            return {
                ...state,
                undoableNotification: currentAction.payload,
                navigationCountAfterNotification: 0
            };
        }

        // Required to dismiss the undoNotification dialog, when user navigate in the app.
        // When deleted a keymap or macro the app automaticaly navigate to other keymap, or macro, so
        // so we have to count the navigations and when reach the 2nd then remove the dialog.
        case ROUTER_NAVIGATION: {
            const newState = {...state};
            newState.navigationCountAfterNotification++;

            if (newState.navigationCountAfterNotification > 1) {
                newState.undoableNotification = null;
            }

            return newState;
        }

        case ActionTypes.UNDO_LAST_SUCCESS:
        case ActionTypes.DISMISS_UNDO_NOTIFICATION: {
            return {
                ...state,
                undoableNotification: null
            };
        }

        case UserConfigActionTypes.LOAD_USER_CONFIG_SUCCESS:
        case UserConfigActionTypes.SAVE_USER_CONFIG_SUCCESS: {
            return {
                ...state,
                prevUserConfig: action.payload,
                configLoading: false
            };
        }

        case UserConfigActionTypes.LOAD_CONFIG_FROM_DEVICE:
        case UserConfigActionTypes.LOAD_USER_CONFIG: {
            return {
                ...state,
                configLoading: true
            };
        }

        case ActionTypes.LOAD_HARDWARE_CONFIGURATION_SUCCESS:
            return {
                ...state,
                hardwareConfig: action.payload
            };

        case DeviceActionTypes.CONNECTION_STATE_CHANGED: {

            if (action.payload === true) {
                return state;
            }

            return {
                ...state,
                hardwareConfig: null
            };
        }

        default:
            return state;
    }
}

export const showAddonMenu = (state: State) => state.showAddonMenu;
export const autoWriteUserConfiguration = (state: State) => state.autoWriteUserConfiguration;
export const getUndoableNotification = (state: State) => state.undoableNotification;
export const getPrevUserConfiguration = (state: State) => state.prevUserConfig;
export const runningInElectron = (state: State) => state.runningInElectron;
export const getHardwareConfiguration = (state: State) => state.hardwareConfig;
export const getKeyboardLayout = (state: State): KeyboardLayout => {
    if (state.hardwareConfig && state.hardwareConfig.isIso) {
        return KeyboardLayout.ISO;
    }

    return KeyboardLayout.ANSI;
};
export const deviceConfigurationLoaded = (state: State) => !state.runningInElectron ? true : !!state.hardwareConfig;
export const getAgentVersionInfo = (state: State) => state.agentVersionInfo || {} as VersionInformation;
