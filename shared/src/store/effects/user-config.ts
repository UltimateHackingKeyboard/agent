import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

import {
    ActionTypes,
    LoadUserConfigAction,
    LoadUserConfigSuccessAction,
    SaveUserConfigSuccessAction
} from '../actions/user-config';

import { UserConfiguration } from '../../config-serializer/config-items/user-configuration';
import { DATA_STORAGE_REPOSITORY, DataStorageRepositoryService } from '../../services/datastorage-repository.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { AppState, getUserConfiguration } from '../index';
import { KeymapActions } from '../actions/keymap';
import { MacroActions } from '../actions/macro';
import { DismissUndoNotificationAction, ShowNotificationAction } from '../actions/app.action';
import { NotificationType } from '../../models/notification';

@Injectable()
export class UserConfigEffects {

    @Effect() loadUserConfig$: Observable<Action> = this.actions$
        .ofType(ActionTypes.LOAD_USER_CONFIG)
        .startWith(new LoadUserConfigAction())
        .switchMap(() => Observable.of(new LoadUserConfigSuccessAction(this.getUserConfiguration())));

    @Effect() saveUserConfig$: Observable<Action> = this.actions$
        .ofType(
            KeymapActions.ADD, KeymapActions.DUPLICATE, KeymapActions.EDIT_NAME, KeymapActions.EDIT_ABBR,
            KeymapActions.SET_DEFAULT, KeymapActions.REMOVE, KeymapActions.SAVE_KEY,
            MacroActions.ADD, MacroActions.DUPLICATE, MacroActions.EDIT_NAME, MacroActions.REMOVE, MacroActions.ADD_ACTION,
            MacroActions.SAVE_ACTION, MacroActions.DELETE_ACTION, MacroActions.REORDER_ACTION)
        .withLatestFrom(this.store.select(getUserConfiguration))
        .mergeMap(([action, config]) => {
            const prevUserConfiguration = this.getUserConfiguration();
            this.dataStorageRepository.saveConfig(config);

            if (action.type === KeymapActions.REMOVE || action.type === MacroActions.REMOVE) {
                return [
                    new SaveUserConfigSuccessAction(),
                    new ShowNotificationAction({
                        type: NotificationType.Undoable,
                        message: 'Keymap has been deleted',
                        extra: { type: KeymapActions.UNDO_LAST_ACTION, payload: prevUserConfiguration }
                    })
                ];
            }

            return [new SaveUserConfigSuccessAction(), new DismissUndoNotificationAction()];
        });

    @Effect() undoUserConfig$: Observable<Action> = this.actions$
        .ofType(KeymapActions.UNDO_LAST_ACTION)
        .map(toPayload)
        .switchMap(prevUserConfiguration => {
            this.dataStorageRepository.saveConfig(prevUserConfiguration);
            return Observable.of(new LoadUserConfigSuccessAction(prevUserConfiguration));
        });

    constructor(private actions$: Actions,
                @Inject(DATA_STORAGE_REPOSITORY) private dataStorageRepository: DataStorageRepositoryService,
                private store: Store<AppState>,
                private defaultUserConfigurationService: DefaultUserConfigurationService) {
    }

    private getUserConfiguration() {
        const configJsonObject = this.dataStorageRepository.getConfig();
        let config: UserConfiguration;

        if (configJsonObject) {
            if (configJsonObject.dataModelVersion === this.defaultUserConfigurationService.getDefault().dataModelVersion) {
                config = new UserConfiguration().fromJsonObject(configJsonObject);
            }
        }

        if (!config) {
            config = this.defaultUserConfigurationService.getDefault();
        }

        return config;

    }
}
