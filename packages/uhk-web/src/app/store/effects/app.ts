import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, mergeMap, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

import { ApplicationSettings, AppStartInfo, LogService, Notification, NotificationType } from 'uhk-common';
import {
    ActionTypes,
    ApplyAppStartInfoAction,
    AppStartedAction,
    DismissUndoNotificationAction,
    LoadApplicationSettingsSuccessAction,
    NavigateTo,
    OpenUrlInNewWindowAction,
    ProcessAppStartInfoAction,
    SaveApplicationSettingsSuccessAction,
    ShowNotificationAction,
    UndoLastAction
} from '../actions/app';
import { ActionTypes as UpdateActionTypes } from '../actions/auto-update-settings';
import { AppRendererService } from '../../services/app-renderer.service';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { ActionTypes as DeviceActionTypes, ConnectionStateChangedAction } from '../actions/device';
import { AppState, getApplicationSettings, runningInElectron } from '../index';
import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';

@Injectable()
export class ApplicationEffects {

    @Effect()
    appStart$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.AppBootstrapped),
            startWith(new AppStartedAction()),
            tap(() => {
                this.logService.info('Renderer appStart effect start');
                this.appUpdateRendererService.sendAppStarted();
                this.appRendererService.getAppStartInfo();
                this.logService.info('Renderer appStart effect end');
            }),
            map(() => {
                const settings = this.dataStorageRepository.getApplicationSettings() || {
                    checkForUpdateOnStartUp: true,
                    everAttemptedSavingToKeyboard: false
                };

                return new LoadApplicationSettingsSuccessAction(settings);
            })
        );

    @Effect({ dispatch: false })
    appStartInfo$: Observable<Action> = this.actions$
        .pipe(
            ofType(ActionTypes.LoadAppStartInfo),
            tap(() => {
                this.appRendererService.getAppStartInfo();
            })
        );

    @Effect({ dispatch: false })
    showNotification$: Observable<Action> = this.actions$
        .pipe(
            ofType<ShowNotificationAction>(ActionTypes.AppShowNotification),
            map(action => action.payload),
            tap((notification: Notification) => {
                if (notification.type === NotificationType.Undoable) {
                    return;
                }
                this.notifierService.notify(notification.type, notification.message);
            })
        );

    @Effect()
    processStartInfo$: Observable<Action> = this.actions$
        .pipe(
            ofType<ProcessAppStartInfoAction>(ActionTypes.AppProcessStartInfo),
            map(action => action.payload),
            mergeMap((appInfo: AppStartInfo) => {
                this.logService.debug('[AppEffect][processStartInfo] payload:', appInfo);
                return [
                    new ApplyAppStartInfoAction(appInfo),
                    new ConnectionStateChangedAction(appInfo.deviceConnectionState)
                ];
            })
        );

    @Effect() undoLastNotification$: Observable<Action> = this.actions$
        .pipe(
            ofType<UndoLastAction>(ActionTypes.UndoLast),
            map(action => action.payload),
            mergeMap((action: Action) => [action, new DismissUndoNotificationAction()])
        );

    @Effect({ dispatch: false }) openUrlInNewWindow$ = this.actions$
        .pipe(
            ofType<OpenUrlInNewWindowAction>(ActionTypes.OpenUrlInNewWindow),
            withLatestFrom(this.store.select(runningInElectron)),
            tap(([action, inElectron]) => {
                const url = action.payload;

                if (inElectron) {
                    this.appRendererService.openUrl(url);
                } else {
                    window.open(url, '_blank');
                }
            })
        );

    @Effect() saveApplicationSettings$ = this.actions$
        .pipe(
            ofType(
                UpdateActionTypes.ToggleCheckForUpdateOnStartup,
                DeviceActionTypes.SaveConfiguration
            ),
            withLatestFrom(this.store.select(getApplicationSettings)),
            map(([, config]) => config),
            map((config: ApplicationSettings) => {
                this.dataStorageRepository.saveApplicationSettings(config);

                return new SaveApplicationSettingsSuccessAction();
            })
        );

    @Effect({ dispatch: false }) navigateTo$ = this.actions$
        .pipe(
            ofType<NavigateTo>(ActionTypes.NavigateTo),
            map(action => action.payload),
            tap(payload => {
                setTimeout(() => {
                    this.logService.info('[AppEffects] navigate to', payload);
                    this.router.navigate(payload.commands, payload.extras);
                }, 10);
            })
        );

    constructor(private actions$: Actions,
                private notifierService: NotifierService,
                private appUpdateRendererService: AppUpdateRendererService,
                private appRendererService: AppRendererService,
                private logService: LogService,
                private store: Store<AppState>,
                private dataStorageRepository: DataStorageRepositoryService,
                private router: Router) {
    }
}
