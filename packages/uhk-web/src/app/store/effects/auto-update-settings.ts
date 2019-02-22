import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { map, startWith, switchMap, withLatestFrom } from 'rxjs/operators';

import { AutoUpdateSettings, NotificationType } from 'uhk-common';

import {
    ActionTypes,
    LoadAutoUpdateSettingsAction,
    LoadAutoUpdateSettingsSuccessAction,
    SaveAutoUpdateSettingsSuccessAction
} from '../actions/auto-update-settings';

import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { AppState, getAutoUpdateSettings } from '../index';
import { initialState } from '../reducers/auto-update-settings';
import { ShowNotificationAction } from '../actions/app';

@Injectable()
export class AutoUpdateSettingsEffects {
    @Effect() loadUserConfig$: Observable<Action> = this.actions$
        .ofType(ActionTypes.LoadAutoUpdateSettings)
        .pipe(
            startWith(new LoadAutoUpdateSettingsAction()),
            switchMap(() => {
                let settings: AutoUpdateSettings = this.dataStorageRepository.getAutoUpdateSettings();
                if (!settings) {
                    settings = initialState;
                }
                return Observable.of(new LoadAutoUpdateSettingsSuccessAction(settings));
            })
        );

    @Effect() saveAutoUpdateConfig$: Observable<Action> = this.actions$
        .ofType(ActionTypes.ToggleCheckForUpdateOnStartup, ActionTypes.TogglePreReleaseFlag)
        .pipe(
            withLatestFrom(this.store.select(getAutoUpdateSettings)),
            map(([action, config]) => {
                this.dataStorageRepository.saveAutoUpdateSettings(config);
                return new SaveAutoUpdateSettingsSuccessAction();
            })
        );

    @Effect() sendNotification$: Observable<Action> = this.actions$
        .ofType(ActionTypes.CheckForUpdateFailed, ActionTypes.CheckForUpdateSuccess)
        .pipe(
            map(toPayload),
            map((message: string) => {
                return new ShowNotificationAction({
                    type: NotificationType.Info,
                    message
                });
            })
        );

    constructor(private actions$: Actions,
                private dataStorageRepository: DataStorageRepositoryService,
                private store: Store<AppState>) {
    }
}
