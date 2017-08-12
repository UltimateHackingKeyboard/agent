import { Action } from '@ngrx/store';
import { type, IpcResponse } from 'uhk-common';

const PREFIX = '[device] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    SET_PRIVILEGE_ON_LINUX: type(PREFIX + 'set privilege on linux'),
    SET_PRIVILEGE_ON_LINUX_REPLY: type(PREFIX + 'set privilege on linux reply'),
    CONNECTION_STATE_CHANGED: type(PREFIX + 'connection state changed'),
    PERMISSION_STATE_CHANGED: type(PREFIX + 'permission state changed'),
    SAVE_LAYER: type(PREFIX + 'save layer'),
    SAVE_LAYER_REPLY: type(PREFIX + 'save layer reply')
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

export class SaveLayerAction implements Action {
    type = ActionTypes.SAVE_LAYER;

    constructor(public payload: Buffer) {}
}

export class SaveLayerReplyAction implements Action {
    type = ActionTypes.SAVE_LAYER_REPLY;

    constructor(public payload: IpcResponse) {}
}

export type Actions
    = SetPrivilegeOnLinuxAction
    | ConnectionStateChangedAction;
