import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs';
import { map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { DeviceRendererService } from '../../services/device-renderer.service';
import {
    ActionTypes,
    HalvesBondCheckTimeoutAction,
    IsDongleZephyrLoggingEnabledAction,
    IsLeftHalfZephyrLoggingEnabledAction,
    IsRightHalfZephyrLoggingEnabledAction,
} from '../actions/advance-settings.action';
import {
    advanceSettingsState,
    AppState,
    getDongle,
    getIsI2cDebuggingEnabled,
    getLeftHalfDetected,
} from '../index';
import { ActiveButton } from '../reducers/advanced-settings.reducer';

const HALVES_BOND_CHECK_TIMEOUT_MS = 5000;

@Injectable()
export class AdvancedSettingsEffects {
    private readonly actions$ = inject(Actions);
    private readonly deviceRendererService = inject(DeviceRendererService);
    private readonly router = inject(Router);
    private readonly store = inject<Store<AppState>>(Store);

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

    toggleZephyrLogging$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.toggleZephyrLogging),
            withLatestFrom(this.store.select(advanceSettingsState)),
            mergeMap(([, state]) => {
                if (state.activeButton === ActiveButton.ShowZephyrLogs) {
                    return [
                        new IsRightHalfZephyrLoggingEnabledAction(),
                        new IsLeftHalfZephyrLoggingEnabledAction(),
                        new IsDongleZephyrLoggingEnabledAction(),
                    ]
                }

                return []
            } )
        )
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

    halvesBondCheckTimeout$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.leftHalfPairingSuccess),
            switchMap(() => timer(HALVES_BOND_CHECK_TIMEOUT_MS)),
            map(() => new HalvesBondCheckTimeoutAction()),
        )
    );

    // the pairing log is visible only on the advanced settings page
    leftHalfPairingFailed$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.leftHalfPairingFailed),
            tap(()=> {
                this.router.navigate(['/device/advanced-settings']);
            })
        ),
    {dispatch: false},
    );
}
