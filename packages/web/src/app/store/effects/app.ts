import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { NotifierService } from 'angular-notifier';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { ActionTypes, DismissUndoNotificationAction, ToggleAddonMenuAction } from '../actions/app.action';
import { Notification, NotificationType } from '../../models/notification';
import { CommandLineArgs } from '../../models/command-line-args';

@Injectable()
export class ApplicationEffects {

    @Effect({ dispatch: false })
    appStart$: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_SHOW_NOTIFICATION)
        .map(toPayload)
        .do((notification: Notification) => {
            if (notification.type === NotificationType.Undoable) {
                return;
            }
            this.notifierService.notify(notification.type, notification.message);
        });

    @Effect()
    processCommandLineArgs: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_PROCESS_COMMAND_LINE_ARGS)
        .map(toPayload)
        .map((args: CommandLineArgs) => new ToggleAddonMenuAction(args.addons || false));

    @Effect() undoLastNotification$: Observable<Action> = this.actions$
        .ofType(ActionTypes.UNDO_LAST)
        .map(toPayload)
        .mergeMap((action: Action) => [action, new DismissUndoNotificationAction()]);

    constructor(private actions$: Actions,
                private notifierService: NotifierService) { }
}
