import { routerActions } from '@ngrx/router-store';
import { Action } from '@ngrx/store';

import { ActionTypes, ShowNotificationAction } from '../actions/app.action';
import { Notification, NotificationType } from '../../models/notification';

export interface State {
    started: boolean;
    showAddonMenu: boolean;
    undoableNotification?: Notification;
    navigationCountAfterNotification: number;
}

const initialState: State = {
    started: false,
    showAddonMenu: false,
    navigationCountAfterNotification: 0
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case ActionTypes.APP_STARTED: {
            return Object.assign({ ...state }, { started: true });
        }

        case ActionTypes.APP_TOGGLE_ADDON_MENU: {
            return Object.assign({ ...state }, { showAddonMenu: action.payload });
        }

        case ActionTypes.APP_SHOW_NOTIFICATION: {
            const currentAction = <ShowNotificationAction>action;
            if (currentAction.payload.type !== NotificationType.Undoable) {
                return state;
            }
            return Object.assign({ ...state }, {
                undoableNotification: currentAction.payload,
                navigationCountAfterNotification: 0
            });
        }

        // Required to dismiss the undoNotification dialog, when user navigate in the app.
        // When deleted a keymap or macro the app automaticaly navigate to other keymap, or macro, so
        // so we have to count the navigations and when reach the 2nd then remove the dialog.
        case routerActions.UPDATE_LOCATION: {
            const newState = { ...state };
            newState.navigationCountAfterNotification++;

            if (newState.navigationCountAfterNotification > 1) {
                newState.undoableNotification = null;
            }

            return newState;
        }

        case ActionTypes.UNDO_LAST_SUCCESS:
        case ActionTypes.DISMISS_UNDO_NOTIFICATION: {
            return Object.assign({ ...state }, { undoableNotification: null });
        }

        default:
            return state;
    }
}

export const showAddonMenu = (state: State) => state.showAddonMenu;
export const getUndoableNotification = (state: State) => state.undoableNotification;
