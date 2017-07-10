import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { NotifierService } from 'angular-notifier';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { ActionTypes } from '../actions/app.action';
import { Notification, NotificationType } from '../../models/notification';

@Injectable()
export class ApplicationEffects {

    @Effect({ dispatch: false })
    appStart$: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_SHOW_NOTIFICATION)
        .map(toPayload)
        .do((notification: Notification) => {
            const type = ApplicationEffects.mapNotificationType(notification.type);
            this.notifierService.notify(type, notification.message);
        });

    // TODO: Change typescript -> 2.4 and use string enum.
    // Corrently ngrx store is not compatible witn typescript 2.4
    private static mapNotificationType(type: NotificationType): string {
        switch (type) {
            case NotificationType.Success:
                return 'success';

            case NotificationType.Error:
                return 'error';

            case NotificationType.Info:
                return 'info';

            case NotificationType.Warning:
                return 'warning';

            default:
                return 'default';
        }
    }

    constructor(private actions$: Actions,
                private notifierService: NotifierService) { }
}
