import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { ERR_UPDATER_INVALID_SIGNATURE, LogService, NotificationType } from 'uhk-common';

import {
    ActionTypes,
    ForceUpdateAction,
    InvalidCodesignSignatureAction,
    ResetUpdateDismissAction,
    UpdateAppAction,
    UpdateAvailableAction,
    UpdateDownloadedAction,
    UpdateErrorAction
} from '../actions/app-update.action';
import { ActionTypes as AutoUpdateActionTypes, CheckForUpdateNowAction } from '../actions/auto-update-settings';
import { ShowNotificationAction } from '../actions/app';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { AppState, isForceUpdate, isUpdateDownloaded, isUpdateRequested } from '../index';

@Injectable()
export class AppUpdateEffect {
    updateApp$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.UpdateApp),
            withLatestFrom(this.store.select(isUpdateDownloaded)),
            tap(([, updateDownloaded]) => {
                if (updateDownloaded) {
                    this.appUpdateRendererService.sendUpdateAndRestartApp();
                } else {
                    this.appUpdateRendererService.downloadUpdate();
                }
            })
        ),
    { dispatch: false }
    );

    checkForUpdate$ = createEffect(() => this.actions$
        .pipe(
            ofType<CheckForUpdateNowAction>(AutoUpdateActionTypes.CheckForUpdateNow),
            map(action => action.payload),
            tap((allowPrerelease: boolean) => {
                this.store.dispatch(new ResetUpdateDismissAction());
                this.logService.misc('[AppUpdateEffect] call checkForUpdate');
                this.appUpdateRendererService.checkForUpdate(allowPrerelease);
            })
        ),
    { dispatch: false }
    );

    forceUpdate$ = createEffect(() => this.actions$
        .pipe(
            ofType<ForceUpdateAction>(ActionTypes.ForceUpdate),
            tap(() => {
                this.logService.misc('[AppUpdateEffect] force update agent');
                this.appUpdateRendererService.checkForUpdate(false);
            })
        ),
    { dispatch: false }
    );

    forceUpdateDownload$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateAvailableAction>(ActionTypes.UpdateAvailable),
            withLatestFrom(this.store.select(isForceUpdate)),
            tap(([, forceUpdate]) => {
                if (forceUpdate) {
                    this.appUpdateRendererService.downloadUpdate();
                }
            })
        ),
    { dispatch: false }
    );

    autoInstallAfterDownload$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateDownloadedAction>(ActionTypes.UpdateDownloaded),
            withLatestFrom(
                this.store.select(isForceUpdate),
                this.store.select(isUpdateRequested)
            ),
            filter(([, forceUpdate, updateRequested]) => forceUpdate || updateRequested),
            map(() => new UpdateAppAction())
        )
    );

    handleError$ = createEffect(() => this.actions$
        .pipe(
            ofType<UpdateErrorAction>(ActionTypes.UpdateError),
            map(action => action.payload),
            map((message: string) => {
                if (message === ERR_UPDATER_INVALID_SIGNATURE) {
                    return new InvalidCodesignSignatureAction();
                }

                return new ShowNotificationAction({
                    type: NotificationType.Error,
                    message
                });
            })
        )
    );

    constructor(private actions$: Actions,
                private appUpdateRendererService: AppUpdateRendererService,
                private logService: LogService,
                private store: Store<AppState>) {
    }

}
