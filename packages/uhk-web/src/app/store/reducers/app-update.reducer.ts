import * as AppUpdate from '../actions/app-update.action';
import { UpdateInfo } from '../../models/update-info';
import {
    UpdateAvailableAction,
    UpdateDownloadedAction,
    UpdateDownloadProgressAction
} from '../actions/app-update.action';

export interface State {
    forceUpdate: boolean;
    updateAvailable: boolean;
    updateDownloaded: boolean;
    updateRequested: boolean;
    downloadProgressPercent: number | null;
    doNotUpdateApp: boolean;
    updateInfo: UpdateInfo;
}

export const initialState: State = {
    forceUpdate: false,
    updateAvailable: false,
    updateDownloaded: false,
    updateRequested: false,
    downloadProgressPercent: null,
    doNotUpdateApp: false,
    updateInfo: {
        isPrerelease: false,
        version: ''
    }
};

export function reducer(state = initialState, action: AppUpdate.Actions) {
    switch (action.type) {

        case AppUpdate.ActionTypes.ResetUpdateDismiss:
            return {
                ...state,
                doNotUpdateApp: false
            };

        case AppUpdate.ActionTypes.ClearUpdateAvailability:
            return {
                ...state,
                updateAvailable: false,
                updateDownloaded: false,
                updateRequested: false,
                downloadProgressPercent: null
            };

        case AppUpdate.ActionTypes.ForceUpdate:
            return {
                ...state,
                forceUpdate: true
            };

        case AppUpdate.ActionTypes.UpdateAvailable:
            return {
                ...state,
                updateAvailable: true,
                updateInfo: (action as UpdateAvailableAction).payload
            };

        case AppUpdate.ActionTypes.UpdateApp:
            return {
                ...state,
                updateRequested: !state.updateDownloaded,
                downloadProgressPercent: state.updateDownloaded ? state.downloadProgressPercent : null
            };

        case AppUpdate.ActionTypes.UpdateDownloadProgress:
            return {
                ...state,
                downloadProgressPercent: (action as UpdateDownloadProgressAction).payload
            };

        case AppUpdate.ActionTypes.UpdateDownloaded:
            return {
                ...state,
                updateDownloaded: true,
                downloadProgressPercent: null,
                updateInfo: (action as UpdateDownloadedAction).payload ?? initialState.updateInfo
            };

        case AppUpdate.ActionTypes.DoNotUpdateApp:
            return {
                ...state,
                doNotUpdateApp: true
            };

        case AppUpdate.ActionTypes.UpdateError:
            return {
                ...state,
                updateRequested: false,
                downloadProgressPercent: null
            };

        default:
            return state;
    }
}

export const getShowAppUpdateAvailable = (state: State) =>
    state.updateAvailable && !state.doNotUpdateApp && !state.forceUpdate;
export const getUpdateInfo = (state: State) => state.updateInfo;
export const isForceUpdate = (state: State) => state.forceUpdate;
export const isUpdateRequested = (state: State) => state.updateRequested;
export const isUpdateDownloaded = (state: State) => state.updateDownloaded;
export const getDownloadProgressPercent = (state: State) => state.downloadProgressPercent;
export const isUpdateDownloading = (state: State) => state.updateRequested && !state.updateDownloaded;
