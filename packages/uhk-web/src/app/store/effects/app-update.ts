import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

import { LogService, NotificationType } from 'uhk-common';

import { ActionTypes, UpdateErrorAction } from '../actions/app-update.action';
import { ActionTypes as AutoUpdateActionTypes } from '../actions/auto-update-settings';
import { ShowNotificationAction } from '../actions/app';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';

@Injectable()
export class AppUpdateEffect {
    @Effect({ dispatch: false })
    appStart$: Observable<Action> = this.actions$
        .ofType(ActionTypes.UPDATE_APP)
        .first()
        .do(() => {
            this.appUpdateRendererService.sendUpdateAndRestartApp();
        });

    @Effect({ dispatch: false }) checkForUpdate$: Observable<Action> = this.actions$
        .ofType(AutoUpdateActionTypes.CHECK_FOR_UPDATE_NOW)
        .do(() => {
            this.logService.debug('[AppUpdateEffect] call checkForUpdate');
            this.appUpdateRendererService.checkForUpdate();
        });

    @Effect() handleError$: Observable<Action> = this.actions$
        .ofType<UpdateErrorAction>(ActionTypes.UPDATE_ERROR)
        .map(action => action.payload)
        .map((message: string) => {
            return new ShowNotificationAction({
                type: NotificationType.Error,
                message
            });
        });

    constructor(private actions$: Actions,
                private appUpdateRendererService: AppUpdateRendererService,
                private logService: LogService) {
    }

}
