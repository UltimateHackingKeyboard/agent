import { createSelector } from 'reselect';
import { RouterState } from '@ngrx/router-store';

import { Keymap } from '../config-serializer/config-items/keymap';
import { UserConfiguration } from '../config-serializer/config-items/user-configuration';
import * as fromAppUpdate from './reducers/app-update.reducer';
import * as autoUpdateSettings from './reducers/auto-update-settings';
import * as fromApp from './reducers/app.reducer';

// State interface for the application
export interface AppState {
    userConfiguration: UserConfiguration;
    presetKeymaps: Keymap[];
    autoUpdateSettings: autoUpdateSettings.State;
    app: fromApp.State;
    router: RouterState;
    appUpdate: fromAppUpdate.State;
}

export const getUserConfiguration = (state: AppState) => state.userConfiguration;

export const appState = (state: AppState) => state.app;
export const showAddonMenu = createSelector(appState, fromApp.showAddonMenu);
export const getUndoableNotification = createSelector(appState, fromApp.getUndoableNotification);
export const getPrevUserConfiguration = createSelector(appState, fromApp.getPrevUserConfiguration);

export const appUpdateState = (state: AppState) => state.appUpdate;
export const getShowAppUpdateAvailable = createSelector(appUpdateState, fromAppUpdate.getShowAppUpdateAvailable);

export const appUpdateSettingsState = (state: AppState) => state.autoUpdateSettings;
export const getAutoUpdateSettings = createSelector(appUpdateSettingsState, autoUpdateSettings.getUpdateSettings);
export const getCheckingForUpdate = createSelector(appUpdateSettingsState, autoUpdateSettings.checkingForUpdate);
