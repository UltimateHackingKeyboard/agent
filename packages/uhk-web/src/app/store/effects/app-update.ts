import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';

import { LogService, NotificationType } from 'uhk-common';

import { ActionTypes, UpdateErrorAction } from '../actions/app-update.action';
import { ActionTypes as AutoUpdateActionTypes, CheckForUpdateNowAction } from '../actions/auto-update-settings';
import { ShowNotificationAction } from '../actions/app';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';

@Injectable()
export class AppUpdateEffect {
    @Effect({ dispatch: false })
    appStart$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.UpdateApp),
            first(),
            tap(() => {
                this.appUpdateRendererService.sendUpdateAndRestartApp();
            })
        );

    @Effect({ dispatch: false }) checkForUpdate$ = this.actions$
        .pipe(
            ofType<CheckForUpdateNowAction>(AutoUpdateActionTypes.CheckForUpdateNow),
            map(action => action.payload),
            tap((allowPrerelease: boolean) => {
                this.logService.debug('[AppUpdateEffect] call checkForUpdate');
                this.appUpdateRendererService.checkForUpdate(allowPrerelease);
            })
        );

    @Effect() handleError$: Observable<Action> = this.actions$
        .pipe(
            ofType<UpdateErrorAction>(ActionTypes.UpdateError),
            map(action => action.payload),
            map((message: string) => {
                return new ShowNotificationAction({
                    type: NotificationType.Error,
                    message
                });
            })
        );

    constructor(private actions$: Actions,
                private appUpdateRendererService: AppUpdateRendererService,
                private logService: LogService) {
    }

}
