import { Action } from '@ngrx/store';

import { AppStartInfo, HardwareConfiguration, Notification, type, VersionInformation } from 'uhk-common';
import { ElectronLogEntry } from '../../models/xterm-log';

const PREFIX = '[app] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    APP_BOOTSRAPPED: type(PREFIX + 'bootstrapped'),
    APP_STARTED: type(PREFIX + 'started'),
    APP_SHOW_NOTIFICATION: type(PREFIX + 'show notification'),
    APP_TOGGLE_ADDON_MENU: type(PREFIX + 'toggle add-on menu'),
    APP_PROCESS_START_INFO: type(PREFIX + 'process start info'),
    UNDO_LAST: type(PREFIX + 'undo last action'),
    UNDO_LAST_SUCCESS: type(PREFIX + 'undo last action success'),
    DISMISS_UNDO_NOTIFICATION: type(PREFIX + 'dismiss notification action'),
    LOAD_HARDWARE_CONFIGURATION_SUCCESS: type(PREFIX + 'load hardware configuration success'),
    UPDATE_AGENT_VERSION_INFORMATION: type(PREFIX + 'update agent version information'),
    ELECTRON_MAIN_LOG_RECEIVED: type(PREFIX + 'Electron main log received')
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

export class ProcessAppStartInfoAction implements Action {
    type = ActionTypes.APP_PROCESS_START_INFO;

    constructor(public payload: AppStartInfo) { }
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

export class UpdateAgentVersionInformationAction implements Action {
    type = ActionTypes.UPDATE_AGENT_VERSION_INFORMATION;

    constructor(public payload: VersionInformation) {}
}

export class ElectronMainLogReceivedAction implements Action {
    type = ActionTypes.ELECTRON_MAIN_LOG_RECEIVED;

    constructor(public payload: ElectronLogEntry) {}
}

export type Actions
    = AppStartedAction
    | AppBootsrappedAction
    | ShowNotificationAction
    | ToggleAddonMenuAction
    | ProcessAppStartInfoAction
    | UndoLastAction
    | UndoLastSuccessAction
    | DismissUndoNotificationAction
    | LoadHardwareConfigurationSuccessAction
    | UpdateAgentVersionInformationAction
    | ElectronMainLogReceivedAction
    ;
