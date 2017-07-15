import { Action } from '@ngrx/store';

import { type } from '../../util';
import { Notification } from '../../models/notification';
import { CommandLineArgs } from '../../models/command-line-args';

const PREFIX = '[app] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    APP_BOOTSRAPPED: type(PREFIX + 'bootstrapped'),
    APP_STARTED: type(PREFIX + 'started'),
    APP_SHOW_NOTIFICATION: type(PREFIX + 'show notification'),
    APP_TOGGLE_ADDON_MENU: type(PREFIX + 'toggle add-on menu'),
    APP_PROCESS_COMMAND_LINE_ARGS: type(PREFIX + 'process command line args'),
    UNDO_LAST: type(PREFIX + 'undo last action'),
    UNDO_LAST_SUCCESS: type(PREFIX + 'undo last action success'),
    DISMISS_UNDO_NOTIFICATION: type(PREFIX + 'dismiss notification action')
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

export class ToggleAddonMenuAction implements Action {
    type = ActionTypes.APP_TOGGLE_ADDON_MENU;

    constructor(public payload: boolean) { }
}

export class ProcessCommandLineArgsAction implements Action {
    type = ActionTypes.APP_PROCESS_COMMAND_LINE_ARGS;

    constructor(public payload: CommandLineArgs) { }
}

export class UndoLastAction implements Action {
    type = ActionTypes.UNDO_LAST;

    constructor(public payload: any) {}
}

export class UndoLastSuccessAction implements Action {
    type = ActionTypes.UNDO_LAST_SUCCESS;
}

export class DismissUndoNotificationAction implements Action {
    type = ActionTypes.DISMISS_UNDO_NOTIFICATION;
}

export type Actions
    = AppStartedAction
    | AppBootsrappedAction
    | ShowNotificationAction
    | ToggleAddonMenuAction
    | ProcessCommandLineArgsAction
    | UndoLastAction
    | UndoLastSuccessAction
    | DismissUndoNotificationAction;
