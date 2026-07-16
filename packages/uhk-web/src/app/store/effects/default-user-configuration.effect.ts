import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, startWith, withLatestFrom } from 'rxjs/operators';
import { UHK_80_DEVICE } from 'uhk-common';

import * as AppActions from '../actions/app';
import {
    ActionTypes, AddKeymapSelectedAction,
    LoadDefaultUserConfigurationAction,
    LoadDefaultUserConfigurationSuccessAction
} from '../actions/default-user-configuration.actions';
import * as Device from '../actions/device';
import { DefaultUserConfigurationService } from '../../services/default-user-configuration.service';
import { AppState, getConnectedDevice } from '../index';
import { RouterState } from '../router-util';

@Injectable()
export class DefaultUserConfigurationEffect {
    loadDefaultUserConfigurationOnAppStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(AppActions.ActionTypes.AppBootstrapped),
            startWith(new AppActions.AppStartedAction()),
            map(() => new LoadDefaultUserConfigurationAction())
        )
    );

    reloadDefaultUserConfigurationOnDeviceChange$ = createEffect(() => this.actions$
        .pipe(
            ofType(Device.ActionTypes.ConnectionStateChanged),
            withLatestFrom(this.store.select(getConnectedDevice)),
            map(([, connectedDevice]) => connectedDevice?.id ?? null),
            distinctUntilChanged(),
            map(() => new LoadDefaultUserConfigurationAction())
        )
    );

    loadDefaultUserConfiguration$ = createEffect(() => this.actions$
        .pipe(
            ofType<LoadDefaultUserConfigurationAction>(ActionTypes.LoadDefaultUserConfiguration),
            withLatestFrom(this.store.select(getConnectedDevice)),
            map(([_, connectedDevice]) => {
                if (connectedDevice?.id === UHK_80_DEVICE.id) {
                    return new LoadDefaultUserConfigurationSuccessAction(this.defaultUserConfigurationService.getDefault80());
                }

                return new LoadDefaultUserConfigurationSuccessAction(this.defaultUserConfigurationService.getDefault60());
            })
        )
    );

    addKeymapNavigated$ = createEffect(() => this.actions$
        .pipe(
            ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map<RouterNavigatedAction, RouterState>(action => action.payload.routerState as any),
            filter(routerState => routerState.url.startsWith('/add-keymap')),
            map(routerState => routerState.params.newKeymapAbbr),
            distinctUntilChanged(),
            map((abbreviation: string) => new AddKeymapSelectedAction(abbreviation))
        )
    );

    constructor(private actions$: Actions,
                private defaultUserConfigurationService: DefaultUserConfigurationService,
                private store: Store<AppState>,
    ) {}
}
