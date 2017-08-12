import { Action } from '@ngrx/store';

import { ActionTypes } from '../actions/device';

export interface State {
    connected: boolean;
    hasPermission: boolean;
}

const initialState: State = {
    connected: true,
    hasPermission: true
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connected: action.payload
            };

        case ActionTypes.PERMISSION_STATE_CHANGED:
            return {
                ...state,
                hasPermission: action.payload
            };

        default:
            return state;
    }
}

export const isDeviceConnected = (state: State) => state.connected;
export const hasDevicePermission = (state: State) => state.hasPermission;
