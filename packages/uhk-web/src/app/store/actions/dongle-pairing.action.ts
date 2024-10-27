import { Action } from '@ngrx/store';
import { DeleteHostConnectionPayload } from '../../models/index';

export enum ActionTypes {
    StartDonglePairing = '[dongle-pairing] start dongle pairing',
    DeleteHostConnection = '[dongle-pairing] delete host connection',
    DeleteHostConnectionSuccess = '[dongle-pairing] delete host connection success',
    DeleteHostConnectionFailed = '[dongle-pairing] delete host connection failed',
    DonglePairingSuccess = '[dongle-pairing] dongle pairing success',
    DonglePairingFailed = '[dongle-pairing] dongle pairing failed',
}

export class StartDonglePairingAction implements Action {
    type = ActionTypes.StartDonglePairing;
}

export class DeleteHostConnectionAction implements Action {
    type = ActionTypes.DeleteHostConnection;

    constructor(public payload: DeleteHostConnectionPayload) {}
}

export class DeleteHostConnectionSuccessAction implements Action {
    type = ActionTypes.DeleteHostConnectionSuccess;

    // the index of the deleted host connection and the BLE address
    constructor(public payload: {index: number; address: string}) {}
}

export class DeleteHostConnectionFailedAction implements Action {
    type = ActionTypes.DeleteHostConnectionFailed;

    constructor(public payload: string) {}
}

export class DonglePairingSuccessAction implements Action {
    type = ActionTypes.DonglePairingSuccess;

    // the payload is the dongle BLE Address
    constructor(public payload: string) {}
}

export class DonglePairingFailedAction implements Action {
    type = ActionTypes.DonglePairingFailed;

    constructor(public payload: string) {}
}

export type Actions
    = StartDonglePairingAction
    | DeleteHostConnectionAction
    | DeleteHostConnectionSuccessAction
    | DeleteHostConnectionFailedAction
    | DonglePairingSuccessAction
    | DonglePairingFailedAction
    ;
