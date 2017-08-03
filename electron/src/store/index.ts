/// <reference path="../custom_types/electron-is-dev.d.ts"/>
import { createSelector } from 'reselect';
import { compose } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { ActionReducer, combineReducers } from '@ngrx/store';
import * as isDev from 'electron-is-dev';

import { AppState as CommonState } from '../shared/store';
import * as fromAppUpdate from './reducers/app-update.reducer';
import { reducer as CommonReducer, initialState as commonInitialState } from '../shared/store/reducers';

export interface AppState extends CommonState {
    appUpdate: fromAppUpdate.State;
}

export const reducers = {
    appUpdate: fromAppUpdate.reducer,
    ...CommonReducer
};

export const storeConfig = {
    initialState: {
        appUpdate: fromAppUpdate.initialState,
        ...commonInitialState
    },
    metaReducers: isDev ? [storeFreeze] : []
};

export const appUpdateState = (state: AppState) => state.appUpdate;

export const getShowAppUpdateAvailable = createSelector(appUpdateState, fromAppUpdate.getShowAppUpdateAvailable);
