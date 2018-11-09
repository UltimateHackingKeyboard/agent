import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { NotifierService } from 'angular-notifier';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { AppStartInfo, LogService, Notification, NotificationType } from 'uhk-common';
import {
    ActionTypes,
    ApplyAppStartInfoAction,
    AppStartedAction,
    DismissUndoNotificationAction,
    OpenUrlInNewWindowAction,
    ProcessAppStartInfoAction,
    ShowNotificationAction,
    UndoLastAction
} from '../actions/app';
import { AppRendererService } from '../../services/app-renderer.service';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { ConnectionStateChangedAction } from '../actions/device';
import { AppState, runningInElectron } from '../index';

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

    @Effect({dispatch: false})
    appStartInfo$: Observable<Action> = this.actions$
        .ofType(ActionTypes.LOAD_APP_START_INFO)
        .do(() => {
            this.appRendererService.getAppStartInfo();
        });

    @Effect({dispatch: false})
    showNotification$: Observable<Action> = this.actions$
        .ofType<ShowNotificationAction>(ActionTypes.APP_SHOW_NOTIFICATION)
        .map(action => action.payload)
        .do((notification: Notification) => {
            if (notification.type === NotificationType.Undoable) {
                return;
            }
            this.notifierService.notify(notification.type, notification.message);
        });

    @Effect()
    processStartInfo$: Observable<Action> = this.actions$
        .ofType<ProcessAppStartInfoAction>(ActionTypes.APP_PROCESS_START_INFO)
        .map(action => action.payload)
        .mergeMap((appInfo: AppStartInfo) => {
            this.logService.debug('[AppEffect][processStartInfo] payload:', appInfo);
            return [
                new ApplyAppStartInfoAction(appInfo),
                new ConnectionStateChangedAction(appInfo.deviceConnectionState)
            ];
        });

    @Effect() undoLastNotification$: Observable<Action> = this.actions$
        .ofType<UndoLastAction>(ActionTypes.UNDO_LAST)
        .map(action => action.payload)
        .mergeMap((action: Action) => [action, new DismissUndoNotificationAction()]);

    @Effect({dispatch: false}) openUrlInNewWindow$ = this.actions$
        .ofType<OpenUrlInNewWindowAction>(ActionTypes.OPEN_URL_IN_NEW_WINDOW)
        .withLatestFrom(this.store.select(runningInElectron))
        .do(([action, inElectron]) => {
            const url = action.payload;

            if (inElectron) {
                this.appRendererService.openUrl(url);
            } else {
                window.open(url, '_blank');
            }
        });

    constructor(private actions$: Actions,
                private notifierService: NotifierService,
                private appUpdateRendererService: AppUpdateRendererService,
                private appRendererService: AppRendererService,
                private logService: LogService,
                private store: Store<AppState>) {
    }
}
