import { Action } from '@ngrx/store';
import { HID } from 'node-hid';

import { type } from '../../shared/util';

const PREFIX = '[device] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    INIT_DEVICE: type(PREFIX + 'Init device'),
    DEVICE_ATTACHED: type(PREFIX + 'Device attached'),
    DEVICE_DETACHED: type(PREFIX + 'Device detached'),
    DEVICE_ERROR: type(PREFIX + 'Device error'),
    TRANSFER_DATA: type(PREFIX + 'Transfer data'),
    TRANSFER_DATA_SUCCESS: type(PREFIX + 'Transfer data success')
};

export class InitDeviceAction implements Action {
    type = ActionTypes.INIT_DEVICE;
}

export class DeviceAttachedAction implements Action {
    type = ActionTypes.DEVICE_ATTACHED;

    constructor(public payload: HID) { }
}

export class DeviceDetachedAction implements Action {
    type = ActionTypes.DEVICE_DETACHED;
}

export class DeviceErrorAction implements Action {
    type = ActionTypes.DEVICE_ERROR;

    constructor(public payload: any) { }
}

export class TransferDataAction implements Action {
    type = ActionTypes.TRANSFER_DATA;

    constructor(public payload: any) { }
}

export class TransferDataSuccessAction implements Action {
    type = ActionTypes.TRANSFER_DATA_SUCCESS;
}

export type Actions
    = InitDeviceAction
    | DeviceAttachedAction
    | DeviceDetachedAction
    | DeviceErrorAction
    | TransferDataAction
    | TransferDataSuccessAction;
