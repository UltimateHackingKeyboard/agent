import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

import { ActionTypes } from '../actions/app-update.action';
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

    constructor(
        private actions$: Actions,
        private appUpdateRendererService: AppUpdateRendererService) { }

}
