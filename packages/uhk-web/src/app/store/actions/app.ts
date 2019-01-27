import { Action } from '@ngrx/store';

import { AppStartInfo, HardwareConfiguration, Notification, type } from 'uhk-common';
import { ElectronLogEntry } from '../../models/xterm-log';

const PREFIX = '[app] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    APP_BOOTSRAPPED: type(PREFIX + 'bootstrapped'),
    APP_STARTED: type(PREFIX + 'started'),
    APP_SHOW_NOTIFICATION: type(PREFIX + 'show notification'),
    APPLY_APP_START_INFO: type(PREFIX + 'apply command line args'),
    APP_PROCESS_START_INFO: type(PREFIX + 'process start info'),
    UNDO_LAST: type(PREFIX + 'undo last action'),
    UNDO_LAST_SUCCESS: type(PREFIX + 'undo last action success'),
    DISMISS_UNDO_NOTIFICATION: type(PREFIX + 'dismiss notification action'),
    LOAD_HARDWARE_CONFIGURATION_SUCCESS: type(PREFIX + 'load hardware configuration success'),
    ELECTRON_MAIN_LOG_RECEIVED: type(PREFIX + 'Electron main log received'),
    OPEN_URL_IN_NEW_WINDOW: type(PREFIX + 'Open URL in new Window'),
    PRIVILEGE_WHAT_WILL_THIS_DO: type(PREFIX + 'What will this do clicked'),
    SETUP_PERMISSION_ERROR: type(PREFIX + 'Setup permission error'),
    LOAD_APP_START_INFO: type(PREFIX + 'Load app start info'),
    START_KEYPRESS_CAPTURING: type(PREFIX + 'Start keypress capturing'),
    STOP_KEYPRESS_CAPTURING: type(PREFIX + 'Stop keypress capturing'),
};

export class AppBootsrappedAction implements Action {
    type = ActionTypes.APP_BOOTSRAPPED;
}

export class AppStartedAction implements Action {
    type = ActionTypes.APP_STARTED;
}

export class ShowNotificationAction implements Action {
    type = ActionTypes.APP_SHOW_NOTIFICATION;

    constructor(public payload: Notification) {}
}

export class ApplyAppStartInfoAction implements Action {
    type = ActionTypes.APPLY_APP_START_INFO;

    constructor(public payload: AppStartInfo) {}
}

export class ProcessAppStartInfoAction implements Action {
    type = ActionTypes.APP_PROCESS_START_INFO;

    constructor(public payload: AppStartInfo) {}
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

export class LoadHardwareConfigurationSuccessAction implements Action {
    type = ActionTypes.LOAD_HARDWARE_CONFIGURATION_SUCCESS;

    constructor(public payload: HardwareConfiguration) {}
}

export class ElectronMainLogReceivedAction implements Action {
    type = ActionTypes.ELECTRON_MAIN_LOG_RECEIVED;

    constructor(public payload: ElectronLogEntry) {}
}

export class OpenUrlInNewWindowAction implements Action {
    type = ActionTypes.OPEN_URL_IN_NEW_WINDOW;

    constructor(public payload: string) {}
}

export class PrivilegeWhatWillThisDoAction implements Action {
    type = ActionTypes.PRIVILEGE_WHAT_WILL_THIS_DO;
}

export class SetupPermissionErrorAction implements Action {
    type = ActionTypes.SETUP_PERMISSION_ERROR;

    constructor(public payload: string) {}
}

export class LoadAppStartInfoAction implements Action {
    type = ActionTypes.LOAD_APP_START_INFO;
}

export class StartKeypressCapturingAction implements Action {
    type = ActionTypes.START_KEYPRESS_CAPTURING;
}

export class StopKeypressCapturingAction implements Action {
    type = ActionTypes.STOP_KEYPRESS_CAPTURING;
}

export type Actions =
    | AppStartedAction
    | AppBootsrappedAction
    | ShowNotificationAction
    | ApplyAppStartInfoAction
    | ProcessAppStartInfoAction
    | UndoLastAction
    | UndoLastSuccessAction
    | DismissUndoNotificationAction
    | LoadHardwareConfigurationSuccessAction
    | ElectronMainLogReceivedAction
    | OpenUrlInNewWindowAction
    | PrivilegeWhatWillThisDoAction
    | SetupPermissionErrorAction
    | LoadAppStartInfoAction
    | StartKeypressCapturingAction
    | StopKeypressCapturingAction;
