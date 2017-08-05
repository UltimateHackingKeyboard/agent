import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { ActionTypes, AppStartedAction } from 'uhk-common';
import { AppUpdateRendererService } from '../../services/app-update-renderer.service';
import { AppRendererService } from '../..//services/app-renderer.service';

@Injectable()
export class ApplicationEffects {

    @Effect()
    appStart$: Observable<Action> = this.actions$
        .ofType(ActionTypes.APP_BOOTSRAPPED)
        .startWith(new AppStartedAction())
        .do(() => {
            this.appUpdateRendererService.sendAppStarted();
            this.appRendererService.getCommandLineArgs();
        });

    constructor(private actions$: Actions,
                private appUpdateRendererService: AppUpdateRendererService,
                private appRendererService: AppRendererService
    ) { }
}
