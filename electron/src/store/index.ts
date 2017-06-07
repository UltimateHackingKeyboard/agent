import { createSelector } from 'reselect';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { AppState as CommonState } from '../shared/store';
import * as fromApp from './reducers/app.reducer';
import * as fromAppUpdate from './reducers/app-update.reducer';
import {userConfigurationReducer, presetReducer} from '../../../shared/src/store/reducers/index';

import { isDev } from '../shared/util';

export interface AppState extends CommonState {
    app: fromApp.State;
    appUpdate: fromAppUpdate.State;
}

const reducers = {
    userConfiguration: userConfigurationReducer,
    presetKeymaps: presetReducer,
    router: routerReducer,
    app: fromApp.reducer,
    appUpdate: fromAppUpdate.reducer
};

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<AppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    if (isDev()) {
        return developmentReducer(state, action);
    } else {
        return productionReducer(state, action);
    }
}

export const appUpdateState = (state: AppState) => state.appUpdate;

export const getShowAppUpdateAvailable = createSelector(appUpdateState, fromAppUpdate.getShowAppUpdateAvailable);
