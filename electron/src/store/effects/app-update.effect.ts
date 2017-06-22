import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

import { ActionTypes } from '../actions/app-update.action';
import { ActionTypes as AutoUpdateActionTypes } from '../../shared/store/actions/auto-update-settings';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';

@Injectable()
export class AppUpdateEffect {
    @Effect({ dispatch: false })
    appStart$: Observable<Action> = this.actions$
        .ofType(ActionTypes.UPDATE_APP)
        .first()
        .do(() => {
            this.appUpdateRendererService.sendUpdateAndRestartApp();
        });

    @Effect({ dispatch: false }) checkForUpdate$: Observable<Action> = this.actions$
        .ofType(AutoUpdateActionTypes.CHECK_FOR_UPDATE_NOW)
        .do(() => {
            this.appUpdateRendererService.checkForUpdate();
        });

    constructor(private actions$: Actions,
                private appUpdateRendererService: AppUpdateRendererService) {
    }

}
