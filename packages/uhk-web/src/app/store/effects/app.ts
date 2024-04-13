import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { NotifierService } from '@ert78gb/angular-notifier';

import {
    ApplicationSettings,
    AppStartInfo,
    getLogOptions,
    initBacklightingColorPalette,
    LogService,
    Notification,
    NotificationType
} from 'uhk-common';
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
    SetAppThemeAction,
    ShowNotificationAction,
    UndoLastAction
} from '../actions/app';
import { ActionTypes as UpdateActionTypes } from '../actions/auto-update-settings';
import { AppRendererService } from '../../services/app-renderer.service';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { ActionTypes as DeviceActionTypes, StartConnectionPollerAction } from '../actions/device';
import { ActionTypes as SmartMacroDocActionTypes } from '../actions/smart-macro-doc.action';
import { ActionTypes as UserConfigActionTypes } from '../actions/user-config';
import { AppState, getApplicationSettings, runningInElectron } from '../index';
import { DataStorageRepositoryService } from '../../services/datastorage-repository.service';

@Injectable()
export class ApplicationEffects {

    appStart$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.AppBootstrapped),
            startWith(new AppStartedAction()),
            tap(() => {
                this.logService.misc('Renderer appStart effect start');
                this.appUpdateRendererService.sendAppStarted();
                this.appRendererService.getAppStartInfo();
                this.logService.misc('Renderer appStart effect end');
            }),
            switchMap(() => this.dataStorageRepository.getApplicationSettings()
                .pipe(
                    map(appSettings => {
                        const settings: ApplicationSettings = {
                            backlightingColorPalette: initBacklightingColorPalette(),
                            checkForUpdateOnStartUp: true,
                            everAttemptedSavingToKeyboard: false,
                            animationEnabled: true,
                            keyboardHalvesAlwaysJoined: false,
                            ...appSettings
                        };

                        return new LoadApplicationSettingsSuccessAction(settings);
                    })
                )
            )
        )
    );

    appStartInfo$= createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.LoadAppStartInfo),
            tap(() => {
                this.appRendererService.getAppStartInfo();
            })
        ),
    { dispatch: false }
    );

    showNotification$ = createEffect(() => this.actions$
        .pipe(
            ofType<ShowNotificationAction>(ActionTypes.AppShowNotification),
            map(action => action.payload),
            tap((notification: Notification) => {
                if (notification.type === NotificationType.Undoable) {
                    return;
                }
                this.notifierService.notify(notification.type, notification.message);
            })
        ),
    { dispatch: false }
    );

    processStartInfo$ = createEffect(() => this.actions$
        .pipe(
            ofType<ProcessAppStartInfoAction>(ActionTypes.AppProcessStartInfo),
            map(action => action.payload),
            mergeMap((appInfo: AppStartInfo) => {
                this.logService.setLogOptions(getLogOptions(appInfo.commandLineArgs));
                this.logService.misc('[AppEffect][processStartInfo] payload:', appInfo);
                return [
                    new ApplyAppStartInfoAction(appInfo),
                    new StartConnectionPollerAction()
                ];
            })
        )
    );

    undoLastNotification$ = createEffect(() => this.actions$
        .pipe(
            ofType<UndoLastAction>(ActionTypes.UndoLast),
            map(action => action.payload),
            mergeMap((action: Action) => [action, new DismissUndoNotificationAction()])
        )
    );

    openConfigFolder$ = createEffect(() => this.actions$.pipe(
        ofType(ActionTypes.OpenConfigFolder),
        tap(() => this.appRendererService.openConfigFolder())
    ), { dispatch: false });

    openUrlInNewWindow$ = createEffect(() => this.actions$
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
        ),
    { dispatch: false }
    );

    saveApplicationSettings$ = createEffect(() => this.actions$
        .pipe(
            ofType(
                ActionTypes.ErrorPanelSizeChanged,
                ActionTypes.SetAppTheme,
                ActionTypes.ToggleAnimationEnabled,
                ActionTypes.ToggleKeyboardHalvesAlwaysJoined,
                UpdateActionTypes.ToggleCheckForUpdateOnStartup,
                DeviceActionTypes.SaveConfiguration,
                SmartMacroDocActionTypes.PanelSizeChanged,
                UserConfigActionTypes.AddColorToBacklightingColorPalette,
                UserConfigActionTypes.DeleteColorFromBacklightingColorPalette,
                UserConfigActionTypes.ModifyColorOfBacklightingColorPalette
            ),
            withLatestFrom(this.store.select(getApplicationSettings)),
            map(([, config]) => config),
            switchMap((config: ApplicationSettings) => this.dataStorageRepository.saveApplicationSettings(config)),
            map(() => new SaveApplicationSettingsSuccessAction())
        )
    );

    setAppTheme$ = createEffect(() => this.actions$
        .pipe(
            ofType<SetAppThemeAction>(ActionTypes.SetAppTheme),
            map(action => action.payload),
            tap(theme => {
                if ((window as any).setUhkTheme) {
                    (window as any).setUhkTheme(theme);
                }
            })
        ),
    { dispatch: false }
    );

    navigateTo$ = createEffect(() => this.actions$
        .pipe(
            ofType<NavigateTo>(ActionTypes.NavigateTo),
            map(action => action.payload),
            tap(payload => {
                setTimeout(() => {
                    this.logService.misc('[AppEffects] navigate to', payload);
                    this.router.navigate(payload.commands, payload.extras);
                }, 10);
            })
        ),
    { dispatch: false }
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
