import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { NotifierService } from 'angular-notifier';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ActionTypes, ToggleAddonMenuAction, ShowNotificationAction, UndoLastSuccessAction } from '../actions/app.action';
import { Notification, NotificationType } from '../../models/notification';
import { CommandLineArgs } from '../../models/command-line-args';
import { KeymapActions } from '../actions/keymap';
import { MacroActions } from '../actions/macro';

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
            const type = ApplicationEffects.mapNotificationType(notification.type);
            this.notifierService.notify(type, notification.message);
        });

    @Effect()
    processCommandLineArgs: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_PROCESS_COMMAND_LINE_ARGS)
        .map(toPayload)
        .map((args: CommandLineArgs) => new ToggleAddonMenuAction(args.addons || false));

    @Effect() showUndoableNotification$: Observable<Action> = this.actions$
        .ofType(
            KeymapActions.ADD, KeymapActions.DUPLICATE, KeymapActions.EDIT_NAME, KeymapActions.EDIT_ABBR,
            KeymapActions.SET_DEFAULT, KeymapActions.REMOVE, KeymapActions.SAVE_KEY, KeymapActions.CHECK_MACRO,
            MacroActions.ADD, MacroActions.DUPLICATE, MacroActions.EDIT_NAME, MacroActions.REMOVE, MacroActions.ADD_ACTION,
            MacroActions.SAVE_ACTION, MacroActions.DELETE_ACTION, MacroActions.REORDER_ACTION)
        .map(toPayload)
        .map(payload => {
            return new ShowNotificationAction({
                type: NotificationType.Undoable,
                message: 'Keymap has been modified',
                extra: payload
            });
        });

    @Effect() undoLastNotification$: Observable<Action> = this.actions$
        .ofType(ActionTypes.UNDO_LAST)
        .map(toPayload)
        .do(payload => {
            // TODO: Implement undo functionality;
            throw  new Error('Undo functionality is not implemented yet');
        })
        .map(() => new UndoLastSuccessAction())
        .catch((error: any) => Observable.of(new ShowNotificationAction({
            type: NotificationType.Error,
            message: 'Can not undo the last operation',
            extra: error
        })));

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
