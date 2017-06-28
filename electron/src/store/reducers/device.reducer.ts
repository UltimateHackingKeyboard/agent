import { Action } from '@ngrx/store';
import { HID } from 'node-hid';

import { ActionTypes } from '../actions/device.action';

export interface State {
    device: HID;
    error?: any;
    transferring: boolean;
}

export const initialState: State = {
    device: null,
    transferring: false
};

export function reducer(state = initialState, action: Action): State {
    switch (action.type) {

        case ActionTypes.DEVICE_ATTACHED: {
            return Object.assign({}, state, { error: null, device: action.payload });
        }

        case ActionTypes.DEVICE_DETACHED: {
            return Object.assign({}, state, { error: null, device: null });
        }

        case ActionTypes.DEVICE_ERROR: {
            return Object.assign({}, state, { error: action.payload });
        }

        case ActionTypes.TRANSFER_DATA: {
            return Object.assign({}, state, { transferring: true });
        }

        case ActionTypes.TRANSFER_DATA_SUCCESS: {
            return Object.assign({}, state, { error: null, transferring: false });
        }

        default:
            return state;
    }
}

export const deviceAttached = (state: State) => state.device !== null;
export const deviceTransferringData = (state: State) => state.transferring;
export const getError = (state: State) => state.error;
