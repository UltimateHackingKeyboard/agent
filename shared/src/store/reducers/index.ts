import { routerReducer } from '@ngrx/router-store';

import userConfigurationReducer from './user-configuration';
import presetReducer from './preset';

export { userConfigurationReducer, presetReducer };

// All reducers that are used in application
export const reducer = {
    userConfiguration: userConfigurationReducer,
    presetKeymaps: presetReducer,
    router: routerReducer
};
