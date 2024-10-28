import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';

import { DeviceRendererService } from '../../services/device-renderer.service';
import { ActionTypes } from '../actions/advance-settings.action';
import { AppState, getIsI2cDebuggingEnabled } from '../index';

@Injectable()
export class AdvancedSettingsEffects {
    toggleI2cDebugging$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.toggleI2CDebugging),
            withLatestFrom(this.store.select(getIsI2cDebuggingEnabled)),
            tap(([, enabled])=>{
                this.deviceRendererService.toggleI2cDebugging(enabled);
            })
        ),
    {dispatch: false}
    );

    startLeftHalfPairing$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.startLeftHalfPairing),
            tap(()=> {
                this.deviceRendererService.startLeftHalfPairing();
            })
        ),
    {dispatch: false},
    );

    constructor(private actions$: Actions,
                private store: Store<AppState>,
                private deviceRendererService: DeviceRendererService,
    ){}
}
