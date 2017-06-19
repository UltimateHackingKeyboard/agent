import { createSelector } from 'reselect';

import { Keymap } from '../config-serializer/config-items/Keymap';
import { UserConfiguration } from '../config-serializer/config-items/UserConfiguration';
import * as autoUpdate from './reducers/auto-update-settings';

// State interface for the application
export interface AppState {
    userConfiguration: UserConfiguration;
    presetKeymaps: Keymap[];
    autoUpdateSettings: autoUpdate.State;
}

export const getUserConfiguration = (state: AppState) => state.userConfiguration;

export const appUpdateState = (state: AppState) => state.autoUpdateSettings;

export const getAutoUpdateSettings = createSelector(appUpdateState, autoUpdate.getUpdateSettings);
export const getCheckingForUpdate = createSelector(appUpdateState, autoUpdate.checkingForUpdate);
export const getAutoUpdateMessage = createSelector(appUpdateState, autoUpdate.getMessage);
