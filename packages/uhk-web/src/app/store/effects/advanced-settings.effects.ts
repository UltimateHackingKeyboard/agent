import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';

import { DeviceRendererService } from '../../services/device-renderer.service';
import { ActionTypes } from '../actions/advance-settings.action';
import {
    advanceSettingsState,
    AppState,
    getDongle,
    getIsI2cDebuggingEnabled,
    getLeftHalfDetected,
} from '../index';

@Injectable()
export class AdvancedSettingsEffects {

    isDongleZephyrLoggingEnabled$ = createEffect(() => this.actions$
            .pipe(
                ofType(ActionTypes.isDongleZephyrLoggingEnabled),
                withLatestFrom(this.store.select(getDongle)),
                tap(([, dongle]) => {
                    if (dongle?.serialNumber) {
                        this.deviceRendererService.isDongleZephyrLoggingEnabled();
                    }
                }),
            ),
        {dispatch: false}
    )

    isLeftHalfZephyrLoggingEnabled$ = createEffect(() => this.actions$
            .pipe(
                ofType(ActionTypes.isLeftHalfZephyrLoggingEnabled),
                withLatestFrom(this.store.select(getLeftHalfDetected)),
                tap(([, leftHalfDetected]) => {
                    if (leftHalfDetected) {
                        this.deviceRendererService.isLeftHalfZephyrLoggingEnabled();
                    }
                }),
            ),
        {dispatch: false}
    )

    isRightHalfZephyrLoggingEnabled$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.isRightHalfZephyrLoggingEnabled),
            tap(() => this.deviceRendererService.isRightHalfZephyrLoggingEnabled()),
        ),
        {dispatch: false}
    )

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

    toggleDongleZephyrLogging$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.toggleDongleZephyrLogging),
            withLatestFrom(this.store.select(advanceSettingsState)),
            tap(([, state])=> {
                this.deviceRendererService.toggleDongleZephyrLogging(state.isDongleZephyrLoggingEnabled);
            })
        ),
        {dispatch: false}
    )

    toggleLeftHalfZephyrLogging$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.toggleLeftHalfZephyrLogging),
            withLatestFrom(this.store.select(advanceSettingsState)),
            tap(([, state])=> {
                this.deviceRendererService.toggleLeftHalfZephyrLogging(state.isLeftHalfZephyrLoggingEnabled);
            })
        ),
        {dispatch: false}
    )

    toggleRightHalfZephyrLogging$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.toggleRightHalfZephyrLogging),
            withLatestFrom(this.store.select(advanceSettingsState)),
            tap(([, state])=> {
                this.deviceRendererService.toggleRightHalfZephyrLogging(state.isRightHalfZephyrLoggingEnabled);
            })
        ),
        {dispatch: false}
    )

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
