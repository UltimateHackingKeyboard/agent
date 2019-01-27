import { Action } from '@ngrx/store';
import { ActionTypes } from '../actions/auto-update-settings';
import { ActionTypes as UpdateActions } from '../actions/app-update.action';
import { AutoUpdateSettings } from '../../models/auto-update-settings';

export interface State extends AutoUpdateSettings {
    checkingForUpdate: boolean;
}

export const initialState: State = {
    checkForUpdateOnStartUp: false,
    usePreReleaseUpdate: false,
    checkingForUpdate: false,
};

export function reducer(state = initialState, action: Action & { payload?: any }): State {
    switch (action.type) {
        case ActionTypes.TOGGLE_CHECK_FOR_UPDATE_ON_STARTUP: {
            return Object.assign({}, state, { checkForUpdateOnStartUp: action.payload });
        }

        case ActionTypes.TOGGLE_PRE_RELEASE_FLAG: {
            return Object.assign({}, state, { usePreReleaseUpdate: action.payload });
        }

        case ActionTypes.LOAD_AUTO_UPDATE_SETTINGS_SUCCESS: {
            return Object.assign({}, action.payload);
        }

        case ActionTypes.CHECK_FOR_UPDATE_NOW: {
            return Object.assign({}, state, { checkingForUpdate: true });
        }

        case UpdateActions.UPDATE_ERROR:
        case ActionTypes.CHECK_FOR_UPDATE_SUCCESS:
        case ActionTypes.CHECK_FOR_UPDATE_FAILED: {
            return Object.assign({}, state, { checkingForUpdate: false });
        }

        default:
            return state;
    }
}

export const getUpdateSettings = (state: State) => ({
    checkForUpdateOnStartUp: state.checkForUpdateOnStartUp,
    usePreReleaseUpdate: state.usePreReleaseUpdate,
});

export const checkingForUpdate = (state: State) => state.checkingForUpdate;
