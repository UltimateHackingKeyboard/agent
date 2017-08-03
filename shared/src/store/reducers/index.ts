import { routerReducer } from '@ngrx/router-store';

import userConfigurationReducer from './user-configuration';
import presetReducer from './preset';
import { reducer as autoUpdateReducer } from './auto-update-settings';
import { reducer as appReducer } from './app.reducer';
import { UserConfiguration } from '../../config-serializer/config-items/user-configuration';
import { Keymap } from '../../config-serializer/config-items/keymap';

export { userConfigurationReducer, presetReducer, autoUpdateReducer, appReducer };

// All reducers that are used in application
export const reducer = {
    userConfiguration: userConfigurationReducer,
    presetKeymaps: presetReducer,
    router: routerReducer,
    autoUpdateSettings: autoUpdateReducer,
    app: appReducer
};

export const initialState = {
    userConfiguration: new UserConfiguration(),
    presetKeymaps: <Keymap[]>[],
    autoUpdateSettings: {
        checkForUpdateOnStartUp: false,
        usePreReleaseUpdate: false,
        checkingForUpdate: false
    },
    app: {
        started: false,
        showAddonMenu: false,
        navigationCountAfterNotification: 0
    }
};
