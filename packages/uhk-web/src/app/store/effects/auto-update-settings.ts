import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { NotificationType } from 'uhk-common';

import {
    ActionTypes,
    CheckForUpdateSuccessAction,
    CheckForUpdateFailedAction
} from '../actions/auto-update-settings';

import { ShowNotificationAction } from '../actions/app';

@Injectable()
export class AutoUpdateSettingsEffects {

    sendNotification$: Observable<Action> = createEffect(() => this.actions$
        .pipe(
            ofType<CheckForUpdateSuccessAction | CheckForUpdateFailedAction>(
                ActionTypes.CheckForUpdateFailed, ActionTypes.CheckForUpdateSuccess),
            map(action => action.payload),
            map((message: string) => {
                return new ShowNotificationAction({
                    type: NotificationType.Info,
                    message
                });
            })
        )
    );

    constructor(private actions$: Actions) {
    }
}
