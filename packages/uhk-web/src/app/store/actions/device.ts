import { Action } from '@ngrx/store';
import { type } from 'uhk-common';

const PREFIX = '[device] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    SET_PRIVILEGE_ON_LINUX: type(PREFIX + 'set privilege on linux'),
    CONNECTION_STATE_CHANGED: type(PREFIX + 'connection state changed')
};

export class SetPrivilegeOnLinuxAction implements Action {
    type = ActionTypes.SET_PRIVILEGE_ON_LINUX;
}

export class ConnectionStateChangedAction implements Action {
    type = ActionTypes.CONNECTION_STATE_CHANGED;

    constructor(payload: boolean) {}
}

export type Actions
    = SetPrivilegeOnLinuxAction
    | ConnectionStateChangedAction;
