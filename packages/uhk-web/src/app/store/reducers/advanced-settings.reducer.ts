import { getFormattedTimestamp } from 'uhk-common';

import { XtermCssClass, XtermLog } from '../../models/xterm-log';
import { appendXtermLogs } from '../../util/merge-xterm-logs';
import {
    Actions,
    ActionTypes,
    I2cWatchdogCounterChangedAction,
    IsDongleZephyrLoggingEnabledReplyAction,
    IsLeftHalfZephyrLoggingEnabledReplyAction,
    IsRightHalfZephyrLoggingEnabledReplyAction,
    ZephyrLogAction,
} from '../actions/advance-settings.action';
import * as App from '../actions/app';

export enum ActiveButton {
    None = 'None',
    RepairKeyboardHalf = 'RepairKeyboardHalf',
    I2CRecoveryDebugging = 'I2CRecoveryDebugging',
    ShowZephyrLogs = 'ShowZephyrLogs',
}

export interface State {
    activeButton: ActiveButton;
    i2cDebuggingRingBellEnabled: boolean,
    i2cLogs: Array<XtermLog>;
    isLeftHalfPairing: boolean;
    isDongleZephyrLoggingEnabled: boolean;
    isLeftHalfZephyrLoggingEnabled: boolean;
    isRightHalfZephyrLoggingEnabled: boolean;
    menuVisible: boolean;
}

export const initialState = (): State => ({
    activeButton: ActiveButton.None,
    i2cDebuggingRingBellEnabled: false,
    i2cLogs: [],
    isDongleZephyrLoggingEnabled: false,
    isLeftHalfZephyrLoggingEnabled: false,
    isRightHalfZephyrLoggingEnabled: false,
    isLeftHalfPairing: false,
    menuVisible: false,
});

export function reducer(state = initialState(), action: Actions | App.Actions) {
    switch (action.type) {

        case App.ActionTypes.ElectronMainLogReceived: {
            if (!state.isLeftHalfPairing) {
                return state;
            }

            const payload = (action as App.ElectronMainLogReceivedAction).payload;

            return {
                ...state,
                i2cLogs: appendXtermLogs(state.i2cLogs, payload),
            };
        }

        case ActionTypes.isDongleZephyrLoggingEnabledReply: {
            return {
                ...state,
                isDongleZephyrLoggingEnabled: (action as IsDongleZephyrLoggingEnabledReplyAction).enabled,
            }
        }

        case ActionTypes.isLeftHalfZephyrLoggingEnabledReply: {
            return {
                ...state,
                isLeftHalfZephyrLoggingEnabled: (action as IsLeftHalfZephyrLoggingEnabledReplyAction).enabled,
            }
        }

        case ActionTypes.isRightHalfZephyrLoggingEnabledReply: {
            return {
                ...state,
                isRightHalfZephyrLoggingEnabled: (action as IsRightHalfZephyrLoggingEnabledReplyAction).enabled,
            }
        }

        case ActionTypes.i2cWatchdogCounterChanged: {
            const counter = (action as I2cWatchdogCounterChangedAction).counter;
            const newState = {...state};

            newState.i2cLogs = [
                ...state.i2cLogs,
                {
                    message: `${getFormattedTimestamp()} I2cRecovery: ${counter}`,
                    cssClass: XtermCssClass.standard
                }
            ];

            return newState;
        }

        case ActionTypes.startLeftHalfPairing: {
            return {
                ...state,
                activeButton: ActiveButton.RepairKeyboardHalf,
                i2cLogs: [],
                isLeftHalfPairing: true,
            };
        }

        case ActionTypes.leftHalfPairingSuccess:
        case ActionTypes.leftHalfPairingFailed: {
            return {
                ...state,
                isLeftHalfPairing: false,
            };
        }

        case ActionTypes.toggleI2CDebugging: {
            const newState = {
                ...state,
                i2cLogs: [],
                activeButton: state.activeButton === ActiveButton.I2CRecoveryDebugging
                    ? ActiveButton.None
                    : ActiveButton.I2CRecoveryDebugging,
                isDongleZephyrLoggingEnabled: false,
                isLeftHalfZephyrLoggingEnabled: false,
                isRightHalfZephyrLoggingEnabled: false,
            };

            if (newState.activeButton !== ActiveButton.I2CRecoveryDebugging) {
                newState.i2cDebuggingRingBellEnabled = false;
            }

            return newState;
        }

        case ActionTypes.toggleI2CDebuggingRingBell: {
            return {
                ...state,
                i2cDebuggingRingBellEnabled: !state.i2cDebuggingRingBellEnabled,
            };
        }

        case ActionTypes.toggleDongleZephyrLogging: {
            return {
                ...state,
                isDongleZephyrLoggingEnabled: !state.isDongleZephyrLoggingEnabled,
            }
        }

        case ActionTypes.toggleLeftHalfZephyrLogging: {
            return {
                ...state,
                isLeftHalfZephyrLoggingEnabled: !state.isLeftHalfZephyrLoggingEnabled,
            }
        }

        case ActionTypes.toggleRightHalfZephyrLogging: {
            return {
                ...state,
                isRightHalfZephyrLoggingEnabled: !state.isRightHalfZephyrLoggingEnabled,
            }
        }

        case ActionTypes.toggleZephyrLogging: {
            return {
                ...state,
                i2cLogs: [],
                activeButton: state.activeButton === ActiveButton.ShowZephyrLogs
                    ? ActiveButton.None
                    : ActiveButton.ShowZephyrLogs,
                i2cDebuggingEnabled: false,
                i2cDebuggingRingBellEnabled: false,
            }
        }

        case ActionTypes.showAdvancedSettingsMenu: {
            return {
                ...state,
                menuVisible: true
            };
        }

        case ActionTypes.zephyrLog: {
            const payload = (action as ZephyrLogAction).payload;
            const newState = {...state};

            newState.i2cLogs = [
                ...state.i2cLogs,
                {
                    message: `${getFormattedTimestamp()} | ${payload.device.padEnd(15 )} | ${payload.log}`,
                    cssClass: payload.level === 'error' ? XtermCssClass.error : XtermCssClass.standard,
                }
            ];

            return newState;
        }

        default: {
            return state;
        }
    }
}

export const isAdvancedSettingsMenuVisible = (state: State): boolean => state.menuVisible;
export const isLeftHalfPairing = (state: State): boolean => state.isLeftHalfPairing;
export const isI2cDebuggingEnabled = (state: State): boolean => state.activeButton === ActiveButton.I2CRecoveryDebugging;
export const isI2cDebuggingRingBellEnabled = (state: State): boolean => state.i2cDebuggingRingBellEnabled;
