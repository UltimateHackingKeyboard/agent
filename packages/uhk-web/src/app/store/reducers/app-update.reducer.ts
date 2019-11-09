import * as AppUpdate from '../actions/app-update.action';
import { UpdateInfo } from '../../models/update-info';
import { UpdateDownloadedAction } from '../actions/app-update.action';

export interface State {
    updateAvailable: boolean;
    updateDownloaded: boolean;
    doNotUpdateApp: boolean;
    updateInfo: UpdateInfo;
}

export const initialState: State = {
    updateAvailable: false,
    updateDownloaded: false,
    doNotUpdateApp: false,
    updateInfo: {
        isPrerelease: false,
        version: ''
    }
};

export function reducer(state = initialState, action: AppUpdate.Actions) {
    switch (action.type) {
        case AppUpdate.ActionTypes.UpdateAvailable:
            return {
                ...state,
                updateAvailable: true
            };

        case AppUpdate.ActionTypes.UpdateDownloaded:
            return {
                ...state,
                updateDownloaded: true,
                updateInfo: (action as UpdateDownloadedAction).payload || {
                    isPrerelease: false,
                    version: ''
                }
            };

        case AppUpdate.ActionTypes.DoNotUpdateApp:
            return {
                ...state,
                doNotUpdateApp: true
            };

        default:
            return state;
    }
}

export const getShowAppUpdateAvailable = (state: State) => state.updateDownloaded && !state.doNotUpdateApp;
export const getUpdateInfo = (state: State) => state.updateInfo;
