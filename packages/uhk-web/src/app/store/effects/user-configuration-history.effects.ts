import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import { NotificationType } from 'uhk-common';

import { DeviceRendererService } from '../../services/device-renderer.service';
import { EmptyAction } from '../actions/app';
import { ShowNotificationAction } from '../actions/app';
import {
    ActionTypes,
    GetUserConfigurationFromHistoryAction,
    DeleteUserConfigHistoryAction,
    DeleteUserConfigHistoryReplyAction,
} from '../actions/user-configuration-history.actions';

@Injectable()
export class UserConfigurationHistoryEffects {

    deleteUserConfigHistory$ = createEffect(() => this.actions$
            .pipe(
                ofType<DeleteUserConfigHistoryAction>(ActionTypes.DeleteUserConfigHistory),
                tap((action) => {
                    this.deviceRendererService.deleteUserConfigHistory(action.payload)
                })
            ),
        { dispatch: false },
    )

    deleteUserConfigHistoryReply$ = createEffect(() => this.actions$
            .pipe(
                ofType<DeleteUserConfigHistoryReplyAction>(ActionTypes.DeleteUserConfigHistoryReply),
                map((action) => {
                    if (action.payload.success) {
                        this.deviceRendererService.loadUserConfigurationHistory();

                        return new EmptyAction()
                    }

                    return new ShowNotificationAction({
                        message: action.payload.error?.message,
                        type: NotificationType.Error,
                    });
                })
            ),
    )

    loadUserConfigHistory$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.LoadUserConfigurationHistory),
            tap(() => {
                this.deviceRendererService.loadUserConfigurationHistory();
            })
        ),
    { dispatch: false }
    );

    getUserConfigFromHistory$ = createEffect(() => this.actions$
        .pipe(
            ofType<GetUserConfigurationFromHistoryAction>(ActionTypes.GetUserConfigurationFromHistory),
            map(action => action.payload),
            tap((fileName: string) => {
                this.deviceRendererService.getUserConfigurationFromHistory(fileName);
            })
        ),
    { dispatch: false }
    );

    constructor(private actions$: Actions,
                private deviceRendererService: DeviceRendererService
    ) {
    }
}
