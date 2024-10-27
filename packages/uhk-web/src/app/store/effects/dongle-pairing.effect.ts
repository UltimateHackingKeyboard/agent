import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { HostConnections } from 'uhk-common';
import { NotificationType, runInElectron } from 'uhk-common';

import { DeviceRendererService } from '../../services/device-renderer.service';
import { EmptyAction, ShowNotificationAction } from '../actions/app';
import { SaveConfigurationAction } from '../actions/device';
import {
    ActionTypes,
    DeleteHostConnectionAction,
    DeleteHostConnectionFailedAction,
    DeleteHostConnectionSuccessAction,
    DonglePairingFailedAction,
    DonglePairingSuccessAction,
} from '../actions/dongle-pairing.action';
import { AppState, getDongle } from '../index';

@Injectable()
export class DonglePairingEffect {

    deleteHostConnection$ = createEffect(() => this.actions$
        .pipe(
            ofType<DeleteHostConnectionAction>(ActionTypes.DeleteHostConnection),
            withLatestFrom(this.store.select(getDongle)),
            map(([action, dongle ]) => {
                if (runInElectron()) {
                    const isConnectedDongleAddress = action.payload.hostConnection.type === HostConnections.Dongle && dongle?.bleAddress === action.payload.hostConnection.address;
                    this.deviceRendererService.deleteHostConnection(action.payload, isConnectedDongleAddress);
                    return new EmptyAction();
                } else {
                    return new DeleteHostConnectionSuccessAction({
                        index: action.payload.index,
                        address: action.payload.hostConnection.address,
                    });
                }
            })
        ));

    deleteHostConnectionSuccess$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.DeleteHostConnectionSuccess),
            map(() => {
                return new SaveConfigurationAction(true);
            })
        ));

    deleteHostConnectionFailed$ = createEffect(() => this.actions$
        .pipe(
            ofType<DeleteHostConnectionFailedAction>(ActionTypes.DeleteHostConnectionFailed),
            map((action) => {
                return new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: action.payload
                });
            }),
        ));

    startDonglePairing$ = createEffect(() => this.actions$
        .pipe(
            ofType(ActionTypes.StartDonglePairing),
            tap(() => this.deviceRendererService.startDonglePairing()),
        ),
    { dispatch: false }
    );

    donglePairingFailed$ = createEffect(() => this.actions$
        .pipe(
            ofType<DonglePairingFailedAction>(ActionTypes.DonglePairingFailed),
            map(action => {
                return new ShowNotificationAction({
                    type: NotificationType.Error,
                    message: action.payload
                });
            })
        ));

    donglePairingSuccess$ = createEffect(() => this.actions$
        .pipe(
            ofType<DonglePairingSuccessAction>(ActionTypes.DonglePairingSuccess),
            map(() => {
                return new SaveConfigurationAction(true);
            })
        ));

    constructor(private actions$: Actions,
                private deviceRendererService: DeviceRendererService,
                private store: Store<AppState>,
    ){}
}
