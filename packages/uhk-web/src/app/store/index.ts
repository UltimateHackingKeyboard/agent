import { createSelector } from 'reselect';
import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { RouterState, routerReducer } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';

import userConfigurationReducer from './reducers/user-configuration';
import presetReducer from './reducers/preset';
import { Keymap } from '../config-serializer/config-items/keymap';
import { UserConfiguration } from '../config-serializer/config-items/user-configuration';
import * as fromAppUpdate from './reducers/app-update.reducer';
import * as autoUpdateSettings from './reducers/auto-update-settings';
import * as fromApp from './reducers/app.reducer';
import * as fromDevice from './reducers/device';

export const reducers = {
    userConfiguration: userConfigurationReducer,
    presetKeymaps: presetReducer,
    router: routerReducer,
    autoUpdateSettings: autoUpdateSettings.reducer,
    app: fromApp.reducer,
    appUpdate: fromAppUpdate.reducer,
    device: fromDevice.reducer
};

// State interface for the application
export interface AppState {
    userConfiguration: UserConfiguration;
    presetKeymaps: Keymap[];
    autoUpdateSettings: autoUpdateSettings.State;
    app: fromApp.State;
    router: RouterState;
    appUpdate: fromAppUpdate.State;
    device: fromDevice.State;
}

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    // if (isDev) {
        return developmentReducer(state, action);
    // } else {
    //     return productionReducer(state, action);
    // }
}

export const getUserConfiguration = (state: AppState) => state.userConfiguration;

export const appState = (state: AppState) => state.app;
export const showAddonMenu = createSelector(appState, fromApp.showAddonMenu);
export const getUndoableNotification = createSelector(appState, fromApp.getUndoableNotification);
export const getPrevUserConfiguration = createSelector(appState, fromApp.getPrevUserConfiguration);
export const runningInElectron = createSelector(appState, fromApp.runningInElectron);

export const appUpdateState = (state: AppState) => state.appUpdate;
export const getShowAppUpdateAvailable = createSelector(appUpdateState, fromAppUpdate.getShowAppUpdateAvailable);

export const appUpdateSettingsState = (state: AppState) => state.autoUpdateSettings;
export const getAutoUpdateSettings = createSelector(appUpdateSettingsState, autoUpdateSettings.getUpdateSettings);
export const getCheckingForUpdate = createSelector(appUpdateSettingsState, autoUpdateSettings.checkingForUpdate);

export const deviceState = (state: AppState) => state.device;
export const isDeviceConnected = createSelector(deviceState, fromDevice.isDeviceConnected);
export const deviceConnected = createSelector(runningInElectron, isDeviceConnected, (electron, connected) => {
    return !electron ? true : connected;
});
export const devicePermission = createSelector(deviceState, fromDevice.hasDevicePermission);
export const hasDevicePermission = createSelector(runningInElectron, devicePermission, (electron, permission) => {
    return !electron ? true : permission;
});
