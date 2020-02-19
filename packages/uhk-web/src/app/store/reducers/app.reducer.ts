import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import {
    CommandLineArgs,
    HardwareConfiguration,
    Notification,
    NotificationType,
    runInElectron,
    UserConfiguration,
    VersionInformation
} from 'uhk-common';

import * as App from '../actions/app';
import { ActionTypes as UserConfigActionTypes, SaveUserConfigSuccessAction } from '../actions/user-config';
import { ActionTypes as DeviceActionTypes, ConnectionStateChangedAction } from '../actions/device';
import { KeyboardLayout } from '../../keyboard/keyboard-layout.enum';
import { getVersions } from '../../util';

export interface State {
    animationEnabled: boolean;
    started: boolean;
    commandLineArgs: CommandLineArgs;
    undoableNotification?: Notification;
    navigationCountAfterNotification: number;
    prevUserConfig?: UserConfiguration;
    runningInElectron: boolean;
    configLoading: boolean;
    hardwareConfig?: HardwareConfiguration;
    agentVersionInfo?: VersionInformation;
    privilegeWhatWillThisDoClicked: boolean;
    permissionError?: any;
    platform?: string;
    osVersion?: string;
    keypressCapturing: boolean;
    everAttemptedSavingToKeyboard: boolean;
    udevFileContent: string;
}

export const initialState: State = {
    animationEnabled: true,
    started: false,
    commandLineArgs: {},
    navigationCountAfterNotification: 0,
    runningInElectron: runInElectron(),
    configLoading: true,
    agentVersionInfo: getVersions(),
    privilegeWhatWillThisDoClicked: false,
    keypressCapturing: false,
    everAttemptedSavingToKeyboard: false,
    udevFileContent: ''
};

export function reducer(
    state = initialState,
    action: App.Actions | RouterNavigationAction | SaveUserConfigSuccessAction | ConnectionStateChangedAction): State {
    switch (action.type) {
        case App.ActionTypes.AppStarted: {
            return {
                ...state,
                started: true
            };
        }

        case App.ActionTypes.ApplyAppStartInfo: {
            const payload = (action as App.ApplyAppStartInfoAction).payload;

            return {
                ...state,
                commandLineArgs: payload.commandLineArgs,
                platform: payload.platform,
                osVersion: payload.osVersion,
                udevFileContent: payload.udevFileContent
            };
        }

        case App.ActionTypes.AppShowNotification: {
            const currentAction = <App.ShowNotificationAction>action;
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
            const newState = { ...state };
            newState.navigationCountAfterNotification++;

            if (newState.navigationCountAfterNotification > 1) {
                newState.undoableNotification = null;
            }

            return newState;
        }

        case App.ActionTypes.UndoLastSuccess:
        case App.ActionTypes.DismissUndoNotification: {
            return {
                ...state,
                undoableNotification: null
            };
        }

        case UserConfigActionTypes.LoadUserConfigSuccess:
        case UserConfigActionTypes.SaveUserConfigSuccess: {
            return {
                ...state,
                prevUserConfig: (action as SaveUserConfigSuccessAction).payload,
                configLoading: false
            };
        }

        case UserConfigActionTypes.LoadConfigFromDevice:
        case UserConfigActionTypes.LoadUserConfig: {
            return {
                ...state,
                configLoading: true
            };
        }

        case App.ActionTypes.LoadHardwareConfigurationSuccess:
            return {
                ...state,
                hardwareConfig: (action as App.LoadHardwareConfigurationSuccessAction).payload
            };

        case DeviceActionTypes.ConnectionStateChanged: {
            const connectionState = (action as ConnectionStateChangedAction).payload;

            if (connectionState && connectionState.connected === true) {
                return state;
            }

            return {
                ...state,
                hardwareConfig: null
            };
        }

        case App.ActionTypes.PrivilegeWhatWillThisDo:
            return {
                ...state,
                privilegeWhatWillThisDoClicked: true
            };

        case App.ActionTypes.SetupPermissionError:
            return {
                ...state,
                permissionError: (action as App.SetupPermissionErrorAction).payload
            };

        case DeviceActionTypes.SetPrivilegeOnLinux:
            return {
                ...state,
                permissionError: null
            };

        case App.ActionTypes.StartKeypressCapturing:
            return {
                ...state,
                keypressCapturing: true
            };

        case App.ActionTypes.StopKeypressCapturing:
            return {
                ...state,
                keypressCapturing: false
            };

        case App.ActionTypes.LoadApplicationSettingsSuccess: {
            const settings = (action as App.LoadApplicationSettingsSuccessAction).payload;

            return {
                ...state,
                everAttemptedSavingToKeyboard: settings.everAttemptedSavingToKeyboard,
                animationEnabled: settings.animationEnabled
            };
        }

        case DeviceActionTypes.SaveConfiguration:
            return {
                ...state,
                everAttemptedSavingToKeyboard: true
            };

        case App.ActionTypes.ToggleAnimationEnabled:
            return {
                ...state,
                animationEnabled: (action as App.ToggleAnimationEnabledAction).payload
            };

        default:
            return state;
    }
}

export const showAddonMenu = (state: State) => state.commandLineArgs.modules;
export const getUndoableNotification = (state: State) => state.undoableNotification;
export const getPrevUserConfiguration = (state: State) => state.prevUserConfig;
export const runningInElectron = (state: State) => state.runningInElectron;
export const getKeyboardLayout = (state: State): KeyboardLayout => {
    if (state.hardwareConfig && state.hardwareConfig.isIso) {
        return KeyboardLayout.ISO;
    }

    return KeyboardLayout.ANSI;
};
export const deviceConfigurationLoaded = (state: State) => !state.runningInElectron ? true : !!state.hardwareConfig;
export const getAgentVersionInfo = (state: State) => state.agentVersionInfo || {} as VersionInformation;

export const runningOnNotSupportedWindows = (state: State): boolean => {
    if (!state.osVersion || state.platform !== 'win32') {
        return false;
    }

    const version = state.osVersion.split('.');
    const osMajor = +version[0];
    const osMinor = +version[1];

    return osMajor < 6 || (osMajor === 6 && osMinor < 2);
};

export const keypressCapturing = (state: State): boolean => state.keypressCapturing;
export const getEverAttemptedSavingToKeyboard = (state: State): boolean => state.everAttemptedSavingToKeyboard;
export const getUdevFileContent = (state: State): string => state.udevFileContent;
export const getAnimationEnabled = (state: State): boolean => state.animationEnabled;
