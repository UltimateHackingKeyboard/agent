import { Action } from '@ngrx/store';

import { type } from '../../util';
import { Notification } from '../../models/notification';

const PREFIX = '[app] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    APP_BOOTSRAPPED: type(PREFIX + 'bootstrapped'),
    APP_STARTED: type(PREFIX + 'started'),
    APP_SHOW_NOTIFICATION: type(PREFIX + 'show notification')
};

export class AppBootsrappedAction implements Action {
    type = ActionTypes.APP_BOOTSRAPPED;
}

export class AppStartedAction implements Action {
    type = ActionTypes.APP_STARTED;
}

export class ShowNotificationAction implements Action {
    type = ActionTypes.APP_SHOW_NOTIFICATION;

    constructor(public payload: Notification) { }
}

export type Actions
    = AppStartedAction
    | AppBootsrappedAction
    | ShowNotificationAction;
