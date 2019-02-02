import { Actions, ActionTypes, UpdateDownloadedAction } from '../actions/app-update.action';
import { UpdateInfo } from '../../models/update-info';

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

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.UPDATE_AVAILABLE:
            return {
                ...state,
                updateAvailable: true
            };

        case ActionTypes.UPDATE_DOWNLOADED:
            return {
                ...state,
                updateDownloaded: true,
                updateInfo: (action as UpdateDownloadedAction).payload
            };

        case ActionTypes.DO_NOT_UPDATE_APP:
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
