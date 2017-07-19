import { createSelector } from 'reselect';
import { RouterState } from '@ngrx/router-store';

import { Keymap } from '../config-serializer/config-items/keymap';
import { UserConfiguration } from '../config-serializer/config-items/user-configuration';
import * as autoUpdate from './reducers/auto-update-settings';
import * as fromApp from './reducers/app.reducer';

// State interface for the application
export interface AppState {
    userConfiguration: UserConfiguration;
    presetKeymaps: Keymap[];
    autoUpdateSettings: autoUpdate.State;
    app: fromApp.State;
    router: RouterState;
}

export const getUserConfiguration = (state: AppState) => state.userConfiguration;

export const appState = (state: AppState) => state.app;
export const showAddonMenu = createSelector(appState, fromApp.showAddonMenu);
export const getUndoableNotification = createSelector(appState, fromApp.getUndoableNotification);
export const getPrevUserConfiguration = createSelector(appState, fromApp.getPrevUserConfiguration);

export const appUpdateState = (state: AppState) => state.autoUpdateSettings;

export const getAutoUpdateSettings = createSelector(appUpdateState, autoUpdate.getUpdateSettings);
export const getCheckingForUpdate = createSelector(appUpdateState, autoUpdate.checkingForUpdate);
