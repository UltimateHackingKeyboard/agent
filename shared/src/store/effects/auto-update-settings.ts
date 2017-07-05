import { Inject, Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';

import {
    ActionTypes,
    LoadAutoUpdateSettingsAction,
    LoadAutoUpdateSettingsSuccessAction,
    SaveAutoUpdateSettingsSuccessAction
} from '../actions/auto-update-settings';
import { DATA_STORAGE_REPOSITORY, DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { AppState, getAutoUpdateSettings } from '../index';
import { initialState } from '../reducers/auto-update-settings';
import { AutoUpdateSettings } from '../../models/auto-update-settings';

@Injectable()
export class AutoUpdateSettingsEffects {
    @Effect() loadUserConfig$: Observable<Action> = this.actions$
        .ofType(ActionTypes.LOAD_AUTO_UPDATE_SETTINGS)
        .startWith(new LoadAutoUpdateSettingsAction())
        .switchMap(() => {
            let settings: AutoUpdateSettings = this.dataStorageRepository.getAutoUpdateSettings();
            if (!settings) {
                settings = initialState;
            }
            return Observable.of(new LoadAutoUpdateSettingsSuccessAction(settings));
        });

    @Effect() saveAutoUpdateConfig$: Observable<Action> = this.actions$
        .ofType(ActionTypes.TOGGLE_CHECK_FOR_UPDATE_ON_STARTUP, ActionTypes.TOGGLE_PRE_RELEASE_FLAG)
        .withLatestFrom(this.store.select(getAutoUpdateSettings))
        .map(([action, config]) => {
            this.dataStorageRepository.saveAutoUpdateSettings(config);
            return new SaveAutoUpdateSettingsSuccessAction();
        });

    constructor(private actions$: Actions,
                @Inject(DATA_STORAGE_REPOSITORY) private dataStorageRepository: DataStorageRepositoryService,
                private store: Store<AppState>) {
    }
}
