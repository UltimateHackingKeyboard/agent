import { routerReducer } from '@ngrx/router-store';

import userConfigurationReducer from './user-configuration';
import presetReducer from './preset';
import { reducer as autoUpdateReducer } from './auto-update-settings';
import { reducer as appReducer } from './app.reducer';

export { userConfigurationReducer, presetReducer, autoUpdateReducer, appReducer };

// All reducers that are used in application
export const reducer = {
    userConfiguration: userConfigurationReducer,
    presetKeymaps: presetReducer,
    router: routerReducer,
    autoUpdateSettings: autoUpdateReducer,
    app: appReducer
};
