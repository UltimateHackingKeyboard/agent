import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Action } from '@ngrx/store';

import { ActionTypes, ShowNotificationAction } from '../actions/app.action';
import { ActionTypes as UserConfigActionTypes } from '../actions/user-config';
import { Notification, NotificationType } from '../../models/notification';
import { UserConfiguration } from '../../config-serializer/config-items/user-configuration';

export interface State {
    started: boolean;
    showAddonMenu: boolean;
    undoableNotification?: Notification;
    navigationCountAfterNotification: number;
    prevUserConfig?: UserConfiguration;
}

const initialState: State = {
    started: false,
    showAddonMenu: false,
    navigationCountAfterNotification: 0
};

export function reducer(state = initialState, action: Action & { payload?: any}) {
    switch (action.type) {
        case ActionTypes.APP_STARTED: {
            return {
                ...state,
                started: true
            };
        }

        case ActionTypes.APP_TOGGLE_ADDON_MENU: {
            return {
                ...state,
                showAddonMenu: action.payload
            };
        }

        case ActionTypes.APP_SHOW_NOTIFICATION: {
            const currentAction = <ShowNotificationAction>action;
            if (currentAction.payload.type !== NotificationType.Undoable) {
                return state;
            }
            return {
                ...state,
                undoableNotification: currentAction.payload,
                navigationCountAfterNotification: 0
            };
        }

        // Required to dismiss the undoNotification dialog, when user navigate in the app.
        // When deleted a keymap or macro the app automaticaly navigate to other keymap, or macro, so
        // so we have to count the navigations and when reach the 2nd then remove the dialog.
        case ROUTER_NAVIGATION: {
            const newState = { ...state };
            newState.navigationCountAfterNotification++;

            if (newState.navigationCountAfterNotification > 1) {
                newState.undoableNotification = null;
            }

            return newState;
        }

        case ActionTypes.UNDO_LAST_SUCCESS:
        case ActionTypes.DISMISS_UNDO_NOTIFICATION: {
            return {
                ...state,
                undoableNotification: null
            };
        }

        case UserConfigActionTypes.LOAD_USER_CONFIG_SUCCESS:
        case UserConfigActionTypes.SAVE_USER_CONFIG_SUCCESS: {
            return {
                ...state,
                prevUserConfig: action.payload
            };
        }

        default:
            return state;
    }
}

export const showAddonMenu = (state: State) => state.showAddonMenu;
export const getUndoableNotification = (state: State) => state.undoableNotification;
export const getPrevUserConfiguration = (state: State) => state.prevUserConfig;
