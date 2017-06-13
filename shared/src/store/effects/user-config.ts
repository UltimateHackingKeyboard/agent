import { Injectable, Inject } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

import { ActionTypes, LoadUserConfigAction, LoadUserConfigSuccessAction } from '../actions/user-config';
import { UserConfiguration } from '../../config-serializer/config-items/UserConfiguration';
import { DataStorageRepositoryService, DATA_STORAGE_REPOSITORY } from '../../services/datastorage-repository.service';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';

@Injectable()
export class UserConfigEffects {

    @Effect() loadUserConfig$: Observable<Action> = this.actions$
        .ofType(ActionTypes.LOAD_USER_CONFIG)
        .startWith(new LoadUserConfigAction())
        .switchMap(() => {
            let config: UserConfiguration = this.dataStorageRepository.getConfig();
            if (!config) {
                config = this.defaultUserConfigurationService.getDefault();
            }
            return Observable.of(new LoadUserConfigSuccessAction(config));
        });

    constructor(private actions$: Actions,
                @Inject(DATA_STORAGE_REPOSITORY)private dataStorageRepository: DataStorageRepositoryService,
                private defaultUserConfigurationService: DefaultUserConfigurationService) { }
}
