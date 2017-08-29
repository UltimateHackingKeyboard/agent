import { Action } from '@ngrx/store';
import { type, IpcResponse } from 'uhk-common';

const PREFIX = '[device] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    SET_PRIVILEGE_ON_LINUX: type(PREFIX + 'set privilege on linux'),
    SET_PRIVILEGE_ON_LINUX_REPLY: type(PREFIX + 'set privilege on linux reply'),
    CONNECTION_STATE_CHANGED: type(PREFIX + 'connection state changed'),
    PERMISSION_STATE_CHANGED: type(PREFIX + 'permission state changed'),
    SAVE_CONFIGURATION: type(PREFIX + 'save configuration'),
    SAVE_CONFIGURATION_REPLY: type(PREFIX + 'save configuration reply'),
    SAVING_CONFIGURATION: type(PREFIX + 'saving configuration'),
    SHOW_SAVE_TO_KEYBOARD_BUTTON: type(PREFIX + 'show save to keyboard button'),
    SAVE_TO_KEYBOARD_SUCCESS: type(PREFIX + 'save to keyboard success'),
    SAVE_TO_KEYBOARD_FAILED: type(PREFIX + 'save to keyboard failed')
};

export class SetPrivilegeOnLinuxAction implements Action {
    type = ActionTypes.SET_PRIVILEGE_ON_LINUX;
}

export class SetPrivilegeOnLinuxReplyAction implements Action {
    type = ActionTypes.SET_PRIVILEGE_ON_LINUX_REPLY;

    constructor(public payload: IpcResponse) {}
}

export class ConnectionStateChangedAction implements Action {
    type = ActionTypes.CONNECTION_STATE_CHANGED;

    constructor(public payload: boolean) {}
}

export class PermissionStateChangedAction implements Action {
    type = ActionTypes.PERMISSION_STATE_CHANGED;

    constructor(public payload: boolean) {}
}

export class SaveConfigurationAction implements Action {
    type = ActionTypes.SAVE_CONFIGURATION;

    constructor() {}
}

export class SaveConfigurationReplyAction implements Action {
    type = ActionTypes.SAVE_CONFIGURATION_REPLY;

    constructor(public payload: IpcResponse) {}
}

export class SavingConfigurationAction implements Action {
    type = ActionTypes.SAVING_CONFIGURATION;
}

export class ShowSaveToKeyboardButtonAction implements Action {
    type = ActionTypes.SHOW_SAVE_TO_KEYBOARD_BUTTON;
}

export class SaveToKeyboardSuccessAction implements Action {
    type = ActionTypes.SAVE_TO_KEYBOARD_SUCCESS;
}

export class SaveToKeyboardSuccessFailed implements Action {
    type = ActionTypes.SAVE_TO_KEYBOARD_FAILED;
}

export type Actions
    = SetPrivilegeOnLinuxAction
    | ConnectionStateChangedAction
    | ShowSaveToKeyboardButtonAction
    | SavingConfigurationAction
    | SaveToKeyboardSuccessAction
    | SaveToKeyboardSuccessFailed;
