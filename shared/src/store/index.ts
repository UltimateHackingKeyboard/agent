import { createSelector } from 'reselect';
import { RouterState } from '@ngrx/router-store';

import { Keymap } from '../config-serializer/config-items/keymap';
import { UserConfiguration } from '../config-serializer/config-items/user-configuration';
import * as autoUpdate from './reducers/auto-update-settings';
import * as fromApp from './reducers/auto-update-settings';

// State interface for the application
export interface AppState {
    userConfiguration: UserConfiguration;
    presetKeymaps: Keymap[];
    autoUpdateSettings: autoUpdate.State;
    app: fromApp.State;
    router: RouterState;
}

export const getUserConfiguration = (state: AppState) => state.userConfiguration;

export const appUpdateState = (state: AppState) => state.autoUpdateSettings;

export const getAutoUpdateSettings = createSelector(appUpdateState, autoUpdate.getUpdateSettings);
export const getCheckingForUpdate = createSelector(appUpdateState, autoUpdate.checkingForUpdate);
