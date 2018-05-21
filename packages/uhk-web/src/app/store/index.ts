import { createSelector } from 'reselect';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { Keymap, UserConfiguration } from 'uhk-common';

import * as fromUserConfig from './reducers/user-configuration';
import * as fromPreset from './reducers/preset';
import * as fromAppUpdate from './reducers/app-update.reducer';
import * as autoUpdateSettings from './reducers/auto-update-settings';
import * as fromApp from './reducers/app.reducer';
import * as fromDevice from './reducers/device';
import { initProgressButtonState } from './reducers/progress-button-state';
import { environment } from '../../environments/environment';
import { RouterStateUrl } from './router-util';

// State interface for the application
export interface AppState {
    userConfiguration: UserConfiguration;
    presetKeymaps: Keymap[];
    autoUpdateSettings: autoUpdateSettings.State;
    app: fromApp.State;
    router: RouterReducerState<RouterStateUrl>;
    appUpdate: fromAppUpdate.State;
    device: fromDevice.State;
}

export const reducers: ActionReducerMap<AppState> = {
    userConfiguration: fromUserConfig.reducer,
    presetKeymaps: fromPreset.reducer,
    autoUpdateSettings: autoUpdateSettings.reducer,
    app: fromApp.reducer,
    router: routerReducer,
    appUpdate: fromAppUpdate.reducer,
    device: fromDevice.reducer
};

export const metaReducers: MetaReducer<AppState>[] = environment.production
    ? []
    : [storeFreeze];

export const getUserConfiguration = (state: AppState) => state.userConfiguration;

export const appState = (state: AppState) => state.app;

export const showAddonMenu = createSelector(appState, fromApp.showAddonMenu);
export const getUndoableNotification = createSelector(appState, fromApp.getUndoableNotification);
export const getPrevUserConfiguration = createSelector(appState, fromApp.getPrevUserConfiguration);
export const runningInElectron = createSelector(appState, fromApp.runningInElectron);
export const getKeyboardLayout = createSelector(appState, fromApp.getKeyboardLayout);
export const deviceConfigurationLoaded = createSelector(appState, fromApp.deviceConfigurationLoaded);
export const getAgentVersionInfo = createSelector(appState, fromApp.getAgentVersionInfo);
export const getPrivilegePageState = createSelector(appState, fromApp.getPrivilagePageState);

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
export const saveToKeyboardStateSelector = createSelector(deviceState, fromDevice.getSaveToKeyboardState);
export const saveToKeyboardState = createSelector(runningInElectron, saveToKeyboardStateSelector, (electron, state) => {
    return electron ? state : initProgressButtonState;
});
export const updatingFirmware = createSelector(deviceState, fromDevice.updatingFirmware);
export const xtermLog = createSelector(deviceState, fromDevice.xtermLog);
// tslint:disable-next-line: max-line-length
export const flashFirmwareButtonDisbabled = createSelector(runningInElectron, deviceState, (electron, state: fromDevice.State) => !electron || state.updatingFirmware);
export const getHardwareModules = createSelector(deviceState, fromDevice.getHardwareModules);
export const getBackupUserConfigurationState = createSelector(deviceState, fromDevice.getBackupUserConfigurationState);
export const getRestoreUserConfiguration = createSelector(deviceState, fromDevice.getHasBackupUserConfiguration);
export const bootloaderActive = createSelector(deviceState, fromDevice.bootloaderActive);

export const getSideMenuPageState = createSelector(
    showAddonMenu,
    runningInElectron,
    updatingFirmware,
    getUserConfiguration,
    getRestoreUserConfiguration,
    (showAddonMenuValue: boolean,
     runningInElectronValue: boolean,
     updatingFirmwareValue: boolean,
     userConfiguration: UserConfiguration,
     restoreUserConfiguration: boolean) => {
        return {
            showAddonMenu: showAddonMenuValue,
            runInElectron: runningInElectronValue,
            updatingFirmware: updatingFirmwareValue,
            deviceName: userConfiguration.deviceName,
            keymaps: userConfiguration.keymaps,
            macros: userConfiguration.macros,
            restoreUserConfiguration
        };
    }
);

export const getRouterState = (state: AppState) => state.router;
