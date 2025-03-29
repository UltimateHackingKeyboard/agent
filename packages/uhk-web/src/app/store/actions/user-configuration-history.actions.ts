import { Action } from '@ngrx/store';
import { IpcResponse, UserConfigHistory } from 'uhk-common';

export enum ActionTypes {
    ChangeUserConfigurationHistoryTab = '[user-config] Change user configuration history tab',
    DeleteUserConfigHistory = '[user-config] delete user config history',
    DeleteUserConfigHistoryReply = '[user-config] delete user config history reply',
    LoadUserConfigurationHistory = '[user-config] Load user configuration history',
    LoadUserConfigurationHistorySuccess = '[user-config] Load user configuration history success',
    GetUserConfigurationFromHistory = '[user-config] Get user configuration from history'
}

export class ChangeUserConfigurationHistoryTabAction implements Action {
    type = ActionTypes.ChangeUserConfigurationHistoryTab;
    constructor(public payload: number | null) {}
}

export class DeleteUserConfigHistoryAction implements Action {
    type = ActionTypes.DeleteUserConfigHistory;

    /**
     * @param payload - uniqueId of the device
     */
    constructor(public payload: number) {}
}

export class DeleteUserConfigHistoryReplyAction implements Action {
    type = ActionTypes.DeleteUserConfigHistoryReply;

    /**
     * @param payload - uniqueId of the device
     */
    constructor(public payload: IpcResponse) {}
}

export class LoadUserConfigurationHistoryAction implements Action {
    type = ActionTypes.LoadUserConfigurationHistory;
}

export class LoadUserConfigurationHistorySuccessAction implements Action {
    type = ActionTypes.LoadUserConfigurationHistorySuccess;

    constructor(public payload: UserConfigHistory) {
    }
}

export class GetUserConfigurationFromHistoryAction implements Action {
    type = ActionTypes.GetUserConfigurationFromHistory;

    constructor(public payload: string) {
    }
}

export type Actions =
    | ChangeUserConfigurationHistoryTabAction
    | DeleteUserConfigHistoryAction
    | DeleteUserConfigHistoryReplyAction
    | LoadUserConfigurationHistoryAction
    | LoadUserConfigurationHistorySuccessAction
    | GetUserConfigurationFromHistoryAction
    ;
