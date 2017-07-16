import { Action } from '@ngrx/store';

import { ActionTypes } from '../actions/app.action';

export interface State {
    started: boolean;
    showAddonMenu: boolean;
}

const initialState: State = {
    started: false,
    showAddonMenu: false
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.APP_STARTED: {
            return Object.assign({ ...state }, { started: true });
        }

        case ActionTypes.APP_TOGGLE_ADDON_MENU: {
            return Object.assign({ ...state }, { showAddonMenu: action.payload });
        }

        default:
            return state;
    }
}

export const showAddonMenu = (state: State) => state.showAddonMenu;
