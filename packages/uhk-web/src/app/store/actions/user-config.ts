import { Action } from '@ngrx/store';
import { type, UserConfiguration } from 'uhk-common';

const PREFIX = '[user-config] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    LOAD_USER_CONFIG: type(PREFIX + 'Load User Config'),
    LOAD_USER_CONFIG_FROM_DEVICE: type(PREFIX + 'Load User Config from Device'),
    LOAD_USER_CONFIG_FROM_DEVICE_REPLY: type(PREFIX + 'Load User Config from Device reply'),
    LOAD_USER_CONFIG_SUCCESS: type(PREFIX + 'Load User Config Success'),
    SAVE_USER_CONFIG_SUCCESS: type(PREFIX + 'Save User Config Success')
};

export class LoadUserConfigAction implements Action {
    type = ActionTypes.LOAD_USER_CONFIG;
}

export class LoadUserConfigFromDeviceAction implements Action {
    type = ActionTypes.LOAD_USER_CONFIG_FROM_DEVICE;
}

export class LoadUserConfigFromDeviceReplyAction implements Action {
    type = ActionTypes.LOAD_USER_CONFIG_FROM_DEVICE_REPLY;

    constructor(public payload: Array<number>) { }
}

export class LoadUserConfigSuccessAction implements Action {
    type = ActionTypes.LOAD_USER_CONFIG_SUCCESS;

    constructor(public payload: UserConfiguration) { }
}

export class SaveUserConfigSuccessAction implements Action {
    type = ActionTypes.SAVE_USER_CONFIG_SUCCESS;

    constructor(public payload: UserConfiguration) { }
}

export type Actions
    = LoadUserConfigAction
    | LoadUserConfigSuccessAction
    | SaveUserConfigSuccessAction;
