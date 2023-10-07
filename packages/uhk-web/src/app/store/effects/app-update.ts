import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { first, map, tap, withLatestFrom } from 'rxjs/operators';

import { LogService, NotificationType } from 'uhk-common';

import {
    ActionTypes,
    ForceUpdateAction,
    UpdateAppAction,
    UpdateAvailableAction,
    UpdateErrorAction
} from '../actions/app-update.action';
import { ActionTypes as AutoUpdateActionTypes, CheckForUpdateNowAction } from '../actions/auto-update-settings';
import { ShowNotificationAction } from '../actions/app';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { AppState, isForceUpdate } from '../index';

@Injectable()
export class AppUpdateEffect {
    appStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.UpdateApp),
            first(),
            tap(() => {
                this.appUpdateRendererService.sendUpdateAndRestartApp();
            })
        ),
    { dispatch: false }
    );

    checkForUpdate$ = createEffect(() => this.actions$
        .pipe(
            ofType<CheckForUpdateNowAction>(AutoUpdateActionTypes.CheckForUpdateNow),
            map(action => action.payload),
            tap((allowPrerelease: boolean) => {
                this.logService.misc('[AppUpdateEffect] call checkForUpdate');
                this.appUpdateRendererService.checkForUpdate(allowPrerelease);
            })
        ),
    { dispatch: false }
    );

    forceUpdate$ = createEffect(() => this.actions$
        .pipe(
            ofType<ForceUpdateAction>(ActionTypes.ForceUpdate),
            tap(() => {
                this.logService.misc('[AppUpdateEffect] force update agent');
                this.appUpdateRendererService.checkForUpdate(false);
            })
        ),
    { dispatch: false }
    );

    updateAvailable$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateAvailableAction>(ActionTypes.UpdateAvailable),
            withLatestFrom(this.store.select(isForceUpdate)),
            map(([, forceUpdate]) => {
                if (forceUpdate) {
                    return new UpdateAppAction();
                }

                return EMPTY;
            })
        ),
    { dispatch: false }
    );

    handleError$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateErrorAction>(ActionTypes.UpdateError),
            map(action => action.payload),
            map((message: string) => {
                return new ShowNotificationAction({
                    type: NotificationType.Error,
                    message
                });
            })
        )
    );

    constructor(private actions$: Actions,
                private appUpdateRendererService: AppUpdateRendererService,
                private logService: LogService,
                private store: Store<AppState>) {
    }

}
