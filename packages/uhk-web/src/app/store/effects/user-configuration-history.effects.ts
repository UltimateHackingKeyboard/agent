import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

import { DeviceRendererService } from '../../services/device-renderer.service';
import { ActionTypes, GetUserConfigurationFromHistoryAction } from '../actions/user-configuration-history.actions';

@Injectable()
export class UserConfigurationHistoryEffects {
    loadUserConfigHistory$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.LoadUserConfigurationHistory),
            tap(() => {
                this.deviceRendererService.loadUserConfigurationHistory();
            })
        ),
    { dispatch: false }
    );

    getUserConfigFromHistory$ = createEffect(() => this.actions$
        .pipe(
            ofType<GetUserConfigurationFromHistoryAction>(ActionTypes.GetUserConfigurationFromHistory),
            map(action => action.payload),
            tap((fileName: string) => {
                this.deviceRendererService.getUserConfigurationFromHistory(fileName);
            })
        ),
    { dispatch: false }
    );

    constructor(private actions$: Actions,
                private deviceRendererService: DeviceRendererService
    ) {
    }
}
