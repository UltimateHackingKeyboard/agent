import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import {
    ActionTypes, AddKeymapSelectedAction,
    LoadDefaultUserConfigurationAction,
    LoadDefaultUserConfigurationSuccessAction
} from '../actions/default-user-configuration.actions';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { RouterNavigatedAction } from '@ngrx/router-store/src/actions';
import { RouterState } from '../router-util';

@Injectable()
export class DefaultUserConfigurationEffect {
    loadDefaultUserConfiguration$ = createEffect(() => this.actions$
        .pipe(
            ofType<LoadDefaultUserConfigurationAction>(ActionTypes.LoadDefaultUserConfiguration),
            map(() => new LoadDefaultUserConfigurationSuccessAction(this.defaultUserConfigurationService.getDefault60()))
        )
    );

    addKeymapNavigated$ = createEffect(() => this.actions$
        .pipe(
            ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
            map<RouterNavigatedAction, RouterState>(action => action.payload.routerState as any),
            filter(routerState => routerState.url.startsWith('/add-keymap')),
            map(routerState => routerState.params.newKeymapAbbr),
            distinctUntilChanged(),
            map(abbreviation => new AddKeymapSelectedAction(abbreviation))
        )
    );

    constructor(private actions$: Actions,
                private defaultUserConfigurationService: DefaultUserConfigurationService) {
    }
}
