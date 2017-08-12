import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { ActionTypes } from '../actions/device';
import { DeviceRendererService } from '../../services/device-renderer.service';

@Injectable()
export class DeviceEffects {
    @Effect({ dispatch: false })
    deviceConnectionStateChange: Observable<Action> = this.actions$
        .ofType(ActionTypes.CONNECTION_STATE_CHANGED)
        .map(toPayload)
        .do((connected: boolean) => {
            if (!connected) {
                this.router.navigate(['/detection']);
            }
            else {
                this.router.navigate(['/']);
            }
        });

    constructor(private actions$: Actions,
                private router: Router,
                private deviceRendererService: DeviceRendererService) {
    }

}
