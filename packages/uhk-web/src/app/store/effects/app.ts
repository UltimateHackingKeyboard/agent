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

import { CommandLineArgs, Notification, NotificationType } from 'uhk-common';
import { ActionTypes, AppStartedAction, DismissUndoNotificationAction, ToggleAddonMenuAction } from '../actions/app';
import { AppRendererService } from '../../services/app-renderer.service';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';

@Injectable()
export class ApplicationEffects {

    @Effect()
    appStart$: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_BOOTSRAPPED)
        .startWith(new AppStartedAction())
        .do(() => {
            this.appUpdateRendererService.sendAppStarted();
            this.appRendererService.getCommandLineArgs();
        });

    @Effect({ dispatch: false })
    showNotification$: Observable<Action> = this.actions$
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
                private notifierService: NotifierService,
                private appUpdateRendererService: AppUpdateRendererService,
                private appRendererService: AppRendererService) { }
}
