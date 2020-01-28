import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

import { DeviceRendererService } from '../../services/device-renderer.service';
import { ActionTypes, GetUserConfigurationFromHistoryAction } from '../actions/user-configuration-history.actions';

@Injectable()
export class UserConfigurationHistoryEffects {
    @Effect({ dispatch: false }) loadUserConfigHistory$ = this.actions$
        .pipe(
            ofType(ActionTypes.LoadUserConfigurationHistory),
            tap(() => {
                this.deviceRendererService.loadUserConfigurationHistory();
            })
        );

    @Effect({ dispatch: false }) getUserConfigFromHistory$ = this.actions$
        .pipe(
            ofType<GetUserConfigurationFromHistoryAction>(ActionTypes.GetUserConfigurationFromHistory),
            map(action => action.payload),
            tap((fileName: string) => {
                this.deviceRendererService.getUserConfigurationFromHistory(fileName);
            })
        );

    constructor(private actions$: Actions,
                private deviceRendererService: DeviceRendererService
    ) {
    }
}
