import { Action } from '@ngrx/store';
import { DeviceConnectionState, IpcResponse, type } from 'uhk-common';

const PREFIX = '[device] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    SET_PRIVILEGE_ON_LINUX: type(PREFIX + 'set privilege on linux'),
    SET_PRIVILEGE_ON_LINUX_REPLY: type(PREFIX + 'set privilege on linux reply'),
    CONNECTION_STATE_CHANGED: type(PREFIX + 'connection state changed'),
    SAVE_CONFIGURATION: type(PREFIX + 'save configuration'),
    SAVE_CONFIGURATION_REPLY: type(PREFIX + 'save configuration reply'),
    SAVING_CONFIGURATION: type(PREFIX + 'saving configuration'),
    SHOW_SAVE_TO_KEYBOARD_BUTTON: type(PREFIX + 'show save to keyboard button'),
    SAVE_TO_KEYBOARD_SUCCESS: type(PREFIX + 'save to keyboard success'),
    SAVE_TO_KEYBOARD_FAILED: type(PREFIX + 'save to keyboard failed'),
    HIDE_SAVE_TO_KEYBOARD_BUTTON: type(PREFIX + 'hide save to keyboard button'),
    RESET_USER_CONFIGURATION: type(PREFIX + 'reset user configuration'),
    RESET_MOUSE_SPEED_SETTINGS: type(PREFIX + 'reset mouse speed settings'),
    UPDATE_FIRMWARE: type(PREFIX + 'update firmware'),
    UPDATE_FIRMWARE_WITH: type(PREFIX + 'update firmware with'),
    UPDATE_FIRMWARE_REPLY: type(PREFIX + 'update firmware reply'),
    UPDATE_FIRMWARE_SUCCESS: type(PREFIX + 'update firmware success'),
    UPDATE_FIRMWARE_FAILED: type(PREFIX + 'update firmware failed'),
    UPDATE_FIRMWARE_OK_BUTTON: type(PREFIX + 'update firmware ok button click')
};

export class SetPrivilegeOnLinuxAction implements Action {
    type = ActionTypes.SET_PRIVILEGE_ON_LINUX;
}

export class SetPrivilegeOnLinuxReplyAction implements Action {
    type = ActionTypes.SET_PRIVILEGE_ON_LINUX_REPLY;

    constructor(public payload: IpcResponse) {
    }
}

export class ConnectionStateChangedAction implements Action {
    type = ActionTypes.CONNECTION_STATE_CHANGED;

    constructor(public payload: DeviceConnectionState) {
    }
}

export class SaveConfigurationAction implements Action {
    type = ActionTypes.SAVE_CONFIGURATION;

    constructor() {
    }
}

export class SaveConfigurationReplyAction implements Action {
    type = ActionTypes.SAVE_CONFIGURATION_REPLY;

    constructor(public payload: IpcResponse) {
    }
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

export class HideSaveToKeyboardButton implements Action {
    type = ActionTypes.HIDE_SAVE_TO_KEYBOARD_BUTTON;
}

export class ResetUserConfigurationAction implements Action {
    type = ActionTypes.RESET_USER_CONFIGURATION;
}

export class UpdateFirmwareAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE;
}

export class UpdateFirmwareWithAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_WITH;

    constructor(public payload: Array<number>) {
    }
}

export class UpdateFirmwareReplyAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_REPLY;

    constructor(public payload: IpcResponse) {
    }
}

export class UpdateFirmwareSuccessAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_SUCCESS;
}

export class UpdateFirmwareFailedAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_FAILED;

    constructor(public payload: any) {
    }
}

export class UpdateFirmwareOkButtonAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_OK_BUTTON;
}

export class ResetMouseSpeedSettingsAction implements Action {
    type = ActionTypes.RESET_MOUSE_SPEED_SETTINGS;
}

export type Actions
    = SetPrivilegeOnLinuxAction
    | SetPrivilegeOnLinuxReplyAction
    | ConnectionStateChangedAction
    | ShowSaveToKeyboardButtonAction
    | SaveConfigurationAction
    | SaveConfigurationReplyAction
    | SaveToKeyboardSuccessAction
    | SaveToKeyboardSuccessFailed
    | HideSaveToKeyboardButton
    | ResetMouseSpeedSettingsAction
    | ResetUserConfigurationAction
    | UpdateFirmwareAction
    | UpdateFirmwareWithAction
    | UpdateFirmwareReplyAction
    | UpdateFirmwareSuccessAction
    | UpdateFirmwareFailedAction
    | UpdateFirmwareOkButtonAction
    ;
