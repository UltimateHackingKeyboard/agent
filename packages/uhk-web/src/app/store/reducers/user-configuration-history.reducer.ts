import {
    UserConfigHistory,
} from 'uhk-common';

import {
    Actions,
    ActionTypes,
    ChangeUserConfigurationHistoryTabAction,
    LoadUserConfigurationHistorySuccessAction,
} from '../actions/user-configuration-history.actions';

export interface State {
    activeTabIndex: number | null;
    deleting: boolean;
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
    activeTabIndex: null,
    deleting: false,
    userConfigHistory: defaultUserConfigHistory(),
    loading: false
};

export function reducer(state = initialState, action: Actions) {
    switch (action.type) {

        case ActionTypes.ChangeUserConfigurationHistoryTab:
            return {
                ...state,
                activeTabIndex: (action as ChangeUserConfigurationHistoryTabAction).payload,
            };

        case ActionTypes.DeleteUserConfigHistory:
            return {
                ...state,
                deleting: true,
            };

        case ActionTypes.DeleteUserConfigHistoryReply:
            return {
                ...state,
                deleting: false,
            };

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
