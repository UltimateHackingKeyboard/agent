import { routerReducer } from '@ngrx/router-store';

import userConfigurationReducer from './user-configuration';
import presetReducer from './preset';
import { reducer as autoUpdateReducer } from './auto-update-settings';

export { userConfigurationReducer, presetReducer, autoUpdateReducer };

// All reducers that are used in application
export const reducer = {
    userConfiguration: userConfigurationReducer,
    presetKeymaps: presetReducer,
    router: routerReducer,
    autoUpdateSettings: autoUpdateReducer
};
