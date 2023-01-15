import { getFormattedTimestamp } from 'uhk-common';

import { XtermCssClass, XtermLog } from '../../models/xterm-log';
import { I2cWatchdogCounterChangedAction } from '../actions/advance-settings.action';
import { ActionTypes, Actions } from '../actions/advance-settings.action';

export interface State {
    i2cDebuggingEnabled: boolean;
    i2cLogs: Array<XtermLog>;
    menuVisible: boolean;
}

export const initialState = (): State => ({
    i2cDebuggingEnabled: false,
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
            return {
                ...state,
                i2cDebuggingEnabled: !state.i2cDebuggingEnabled
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
