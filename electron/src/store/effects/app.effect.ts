import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import * as app from '../../shared/store/actions/app.action';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';

@Injectable()
export class ApplicationEffect {
    @Effect()
    appStart$: Observable<Action> = this.actions$
        .ofType(app.ActionTypes.APP_BOOTSRAPPED)
        .startWith(new app.AppStartedAction())
        .delay(3000) // wait 3 sec to mainRenderer subscribe all events
        .do(() => {
            this.appUpdateRendererService.sendAppStarted();
        });

    constructor(
        private actions$: Actions,
        private appUpdateRendererService: AppUpdateRendererService) { }
}
