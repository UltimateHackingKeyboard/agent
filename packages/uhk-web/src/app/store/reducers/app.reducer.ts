import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import {
    HardwareConfiguration,
    Notification,
    NotificationType,
    runInElectron,
    UserConfiguration,
    VersionInformation
} from 'uhk-common';

import { ActionTypes, ShowNotificationAction } from '../actions/app';
import { ActionTypes as UserConfigActionTypes } from '../actions/user-config';
import { ActionTypes as DeviceActionTypes } from '../actions/device';
import { KeyboardLayout } from '../../keyboard/keyboard-layout.enum';
import { getVersions } from '../../util';
import { PrivilagePageSate } from '../../models/privilage-page-sate';

export interface State {
    started: boolean;
    showAddonMenu: boolean;
    undoableNotification?: Notification;
    navigationCountAfterNotification: number;
    prevUserConfig?: UserConfiguration;
    runningInElectron: boolean;
    configLoading: boolean;
    hardwareConfig?: HardwareConfiguration;
    agentVersionInfo?: VersionInformation;
    privilegeWhatWillThisDoClicked: boolean;
    permissionError?: any;
}

export const initialState: State = {
    started: false,
    showAddonMenu: false,
    navigationCountAfterNotification: 0,
    runningInElectron: runInElectron(),
    configLoading: true,
    agentVersionInfo: getVersions(),
    privilegeWhatWillThisDoClicked: false
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
                showAddonMenu: action.payload.addons
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

        case ActionTypes.PRIVILEGE_WHAT_WILL_THIS_DO:
            return {
                ...state,
                privilegeWhatWillThisDoClicked: true
            };

        case ActionTypes.SETUP_PERMISSION_ERROR:
            return {
                ...state,
                permissionError: action.payload
            };

        case DeviceActionTypes.SET_PRIVILEGE_ON_LINUX:
            return {
                ...state,
                permissionError: null
            };

        default:
            return state;
    }
}

export const showAddonMenu = (state: State) => state.showAddonMenu;
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
export const getPrivilagePageState = (state: State): PrivilagePageSate => {
    const permissionSetupFailed = !!state.permissionError;

    return {
        permissionSetupFailed,
        showWhatWillThisDo: !state.privilegeWhatWillThisDoClicked && !permissionSetupFailed,
        showWhatWillThisDoContent: state.privilegeWhatWillThisDoClicked || permissionSetupFailed
    };
};
