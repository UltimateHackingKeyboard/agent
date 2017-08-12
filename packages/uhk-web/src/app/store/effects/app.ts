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

import { AppStartInfo, Notification, NotificationType, LogService } from 'uhk-common';
import { ActionTypes, AppStartedAction, DismissUndoNotificationAction, ToggleAddonMenuAction } from '../actions/app';
import { AppRendererService } from '../../services/app-renderer.service';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { ConnectionStateChangedAction, PermissionStateChangedAction } from '../actions/device';

@Injectable()
export class ApplicationEffects {

    @Effect()
    appStart$: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_BOOTSRAPPED)
        .startWith(new AppStartedAction())
        .do(() => {
            this.logService.info('Renderer appStart effect start');
            this.appUpdateRendererService.sendAppStarted();
            this.appRendererService.getAppStartInfo();
            this.logService.info('Renderer appStart effect end');
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
    processStartInfo$: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_PROCESS_START_INFO)
        .map(toPayload)
        .mergeMap((appInfo: AppStartInfo) => {
            this.logService.debug('[AppEffect][processStartInfo] payload:', appInfo);
            return [
                new ToggleAddonMenuAction(appInfo.commandLineArgs.addons),
                new ConnectionStateChangedAction(appInfo.deviceConnected),
                new PermissionStateChangedAction(appInfo.hasPermission)
            ];
        });

    @Effect() undoLastNotification$: Observable<Action> = this.actions$
        .ofType(ActionTypes.UNDO_LAST)
        .map(toPayload)
        .mergeMap((action: Action) => [action, new DismissUndoNotificationAction()]);

    constructor(private actions$: Actions,
                private notifierService: NotifierService,
                private appUpdateRendererService: AppUpdateRendererService,
                private appRendererService: AppRendererService,
                private logService: LogService) { }
}
