import { Actions, ActionTypes } from '../actions/app-update.action';

export interface State {
    updateAvailable: boolean;
    updateDownloaded: boolean;
    doNotUpdateApp: boolean;
}

export const initialState: State = {
    updateAvailable: false,
    updateDownloaded: false,
    doNotUpdateApp: false,
};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {
        case ActionTypes.UPDATE_AVAILABLE: {
            const newState = Object.assign({}, state);
            newState.updateAvailable = true;
            return newState;
        }

        case ActionTypes.UPDATE_DOWNLOADED: {
            const newState = Object.assign({}, state);
            newState.updateDownloaded = true;
            return newState;
        }

        case ActionTypes.DO_NOT_UPDATE_APP: {
            const newState = Object.assign({}, state);
            newState.doNotUpdateApp = true;
            return newState;
        }
        default:
            return state;
    }
}

export const getShowAppUpdateAvailable = (state: State) => state.updateDownloaded && !state.doNotUpdateApp;
