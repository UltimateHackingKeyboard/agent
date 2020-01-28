import { sortStringDesc } from 'uhk-common';

import { Actions, ActionTypes, LoadUserConfigurationHistorySuccessAction } from '../actions/user-configuration-history.actions';

export interface State {
    files: Array<string>;
    loading: boolean;
}

export const initialState: State = {
    files: [],
    loading: false
};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {

        case ActionTypes.LoadUserConfigurationHistory:
            return {
                ...state,
                loading: true,
                files: []
            };

        case ActionTypes.LoadUserConfigurationHistorySuccess:
            return {
                ...state,
                loading: false,
                files: (action as LoadUserConfigurationHistorySuccessAction).payload.sort(sortStringDesc)
            };

        default:
            return state;
    }
}
