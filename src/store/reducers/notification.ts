import { NotificationState } from '../index';

import { Action } from '@ngrx/store';

import { NotificationActions } from '../actions';

const initialState: NotificationState = {
    action: true,
    message: '',
    shown: false
};

export default function(state = initialState, action: Action): NotificationState {
    switch (action.type) {
        case NotificationActions.SHOW:
            return state;

        default: {
            return state;
        }
    }
}
