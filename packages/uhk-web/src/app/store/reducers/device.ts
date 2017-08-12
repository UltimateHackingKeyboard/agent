import { Action } from '@ngrx/store';

import { ActionTypes } from '../actions/device';

export interface State {
    connected: boolean;
    hasPermission: boolean;
}

const initialState: State = {
    connected: false,
    hasPermission: false
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.CONNECTION_STATE_CHANGED:
            return {
                ...state,
                connected: action.payload
            };

        default:
            return state;
    }
}

export const isDeviceConnected = (state: State) => state.connected;
