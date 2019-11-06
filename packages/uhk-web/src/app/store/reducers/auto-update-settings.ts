import * as AutoUpdate from '../actions/auto-update-settings';
import * as AppUpdate from '../actions/app-update.action';
import * as App from '../actions/app';

export interface State {
    checkForUpdateOnStartUp: boolean;
    checkingForUpdate: boolean;
}

export const initialState: State = {
    checkForUpdateOnStartUp: false,
    checkingForUpdate: false
};

export function reducer(state = initialState, action: AutoUpdate.Actions | AppUpdate.Actions | App.Actions): State {
    switch (action.type) {
        case AutoUpdate.ActionTypes.ToggleCheckForUpdateOnStartup: {
            return {
                ...state,
                checkForUpdateOnStartUp: (action as AutoUpdate.ToggleCheckForUpdateOnStartupAction).payload
            };
        }

        case App.ActionTypes.LoadApplicationSettingsSuccess: {
            const { checkForUpdateOnStartUp = true } = (action as App.LoadApplicationSettingsSuccessAction).payload;

            return {
                ...state,
                checkForUpdateOnStartUp
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
