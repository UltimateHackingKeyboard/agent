import { AutoUpdateSettings } from 'uhk-common';

import * as AutoUpdate from '../actions/auto-update-settings';
import * as AppUpdate from '../actions/app-update.action';

export interface State extends AutoUpdateSettings {
    checkingForUpdate: boolean;
}

export const initialState: State = {
    checkForUpdateOnStartUp: false,
    usePreReleaseUpdate: false,
    checkingForUpdate: false
};

export function reducer(state = initialState, action: AutoUpdate.Actions | AppUpdate.Actions): State {
    switch (action.type) {
        case AutoUpdate.ActionTypes.ToggleCheckForUpdateOnStartup: {
            return {
                ...state,
                checkForUpdateOnStartUp: (action as AutoUpdate.ToggleCheckForUpdateOnStartupAction).payload
            };
        }

        case AutoUpdate.ActionTypes.TogglePreReleaseFlag: {
            return {
                ...state,
                usePreReleaseUpdate: (action as AutoUpdate.TogglePreReleaseFlagAction).payload
            };
        }

        case AutoUpdate.ActionTypes.LoadAutoUpdateSettingSuccess: {
            return {
                ...state,
                ...(action as AutoUpdate.LoadAutoUpdateSettingsSuccessAction).payload
            };
        }

        case AutoUpdate.ActionTypes.CheckForUpdateNow: {
            return {
                ...state,
                checkingForUpdate: true
            };
        }

        case AppUpdate.ActionTypes.UpdateError:
        case AutoUpdate.ActionTypes.CheckForUpdateSuccess:
        case AutoUpdate.ActionTypes.CheckForUpdateFailed: {
            return {
                ...state,
                checkingForUpdate: false
            };
        }

        default:
            return state;
    }
}

export const getUpdateSettings = (state: State) => ({
    checkForUpdateOnStartUp: state.checkForUpdateOnStartUp,
    usePreReleaseUpdate: state.usePreReleaseUpdate
});

export const checkingForUpdate = (state: State) => state.checkingForUpdate;
