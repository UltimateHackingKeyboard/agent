import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';

import { DeviceRendererService } from '../../services/device-renderer.service';
import { ActionTypes } from '../actions/advance-settings.action';
import { AppState, getIsI2cDebuggingEnabled, isI2cDebuggingRingBellEnabled } from '../index';

@Injectable()
export class AdvancedSettingsEffects {
    @Effect({dispatch: false}) toggleI2cDebugging$ = this.actions$
        .pipe(
            ofType(ActionTypes.toggleI2CDebugging),
            withLatestFrom(this.store.select(getIsI2cDebuggingEnabled)),
            tap(([, enabled])=>{
                this.deviceRendererService.toggleI2cDebugging(enabled);
            })
        );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private deviceRendererService: DeviceRendererService,
    ){}
}
