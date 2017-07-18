import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import * as app from '../../shared/store/actions/app.action';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { AppRendererService } from '../../services/app-renderer.service';

@Injectable()
export class ApplicationEffect {
    @Effect()
    appStart$: Observable<Action> = this.actions$
        .ofType(app.ActionTypes.APP_BOOTSRAPPED)
        .startWith(new app.AppStartedAction())
        .do(() => {
            this.appUpdateRendererService.sendAppStarted();
            this.appRendererService.getCommandLineArgs();
        });

    constructor(
        private actions$: Actions,
        private appUpdateRendererService: AppUpdateRendererService,
        private appRendererService: AppRendererService) { }
}
