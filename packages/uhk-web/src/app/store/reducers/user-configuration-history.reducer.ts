import {
    UserConfigHistory,
} from 'uhk-common';

import { Actions, ActionTypes, LoadUserConfigurationHistorySuccessAction } from '../actions/user-configuration-history.actions';

export interface State {
    userConfigHistory: UserConfigHistory;
    loading: boolean;
}

function defaultUserConfigHistory(): UserConfigHistory {
    return {
        commonFiles: [],
        devices: []
    };
}

export const initialState: State = {
    userConfigHistory: defaultUserConfigHistory(),
    loading: false
};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {

        case ActionTypes.LoadUserConfigurationHistory:
            return {
                ...state,
                loading: true,
                userConfigHistory: defaultUserConfigHistory()
            };

        case ActionTypes.LoadUserConfigurationHistorySuccess:
            return {
                ...state,
                loading: false,
                userConfigHistory: (action as LoadUserConfigurationHistorySuccessAction).payload
            };

        default:
            return state;
    }
}
