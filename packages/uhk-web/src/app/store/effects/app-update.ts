import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EMPTY, Observable } from 'rxjs';
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
                this.logService.misc('[AppUpdateEffect] call checkForUpdate');
                this.appUpdateRendererService.checkForUpdate(allowPrerelease);
            })
        );

    @Effect({ dispatch: false }) forceUpdate$ = this.actions$
        .pipe(
            ofType<ForceUpdateAction>(ActionTypes.ForceUpdate),
            tap(() => {
                this.logService.misc('[AppUpdateEffect] force update agent');
                this.appUpdateRendererService.checkForUpdate(false);
            })
        );

    @Effect() updateAvailable$ = this.actions$
        .pipe(
            ofType<UpdateAvailableAction>(ActionTypes.UpdateAvailable),
            withLatestFrom(this.store.select(isForceUpdate)),
            map(([, forceUpdate]) => {
                if (forceUpdate) {
                    return new UpdateAppAction();
                }

                return EMPTY;
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
                private logService: LogService,
                private store: Store<AppState>) {
    }

}
