import { getFormattedTimestamp } from 'uhk-common';

import { XtermCssClass, XtermLog } from '../../models/xterm-log';
import { I2cWatchdogCounterChangedAction } from '../actions/advance-settings.action';
import { ActionTypes, Actions } from '../actions/advance-settings.action';

export interface State {
    i2cDebuggingEnabled: boolean;
    i2cDebuggingRingBellEnabled: boolean,
    i2cDebuggingRingBellControlDisabled: boolean,
    i2cLogs: Array<XtermLog>;
    menuVisible: boolean;
}

export const initialState = (): State => ({
    i2cDebuggingEnabled: false,
    i2cDebuggingRingBellEnabled: false,
    i2cDebuggingRingBellControlDisabled: true,
    i2cLogs: [],
    menuVisible: false,
});

export function reducer(state = initialState(), action: Actions) {
    switch (action.type) {

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

        case ActionTypes.toggleI2CDebugging: {
            const newState = {
                ...state,
                i2cDebuggingEnabled: !state.i2cDebuggingEnabled,
            };

            if (newState.i2cDebuggingEnabled) {
                newState.i2cDebuggingRingBellControlDisabled = false;
            } else {
                newState.i2cDebuggingRingBellControlDisabled = true;
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

        case ActionTypes.showAdvancedSettingsMenu: {
            return {
                ...state,
                menuVisible: true
            };
        }

        default: {
            return state;
        }
    }
}

export const isAdvancedSettingsMenuVisible = (state: State): boolean => state.menuVisible;
export const isI2cDebuggingEnabled = (state: State): boolean => state.i2cDebuggingEnabled;
export const isI2cDebuggingRingBellEnabled = (state: State): boolean => state.i2cDebuggingRingBellEnabled;
