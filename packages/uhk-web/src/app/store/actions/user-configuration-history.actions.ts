import { Action } from '@ngrx/store';
import { UserConfigHistory } from 'uhk-common';

export enum ActionTypes {
    LoadUserConfigurationHistory = '[user-config] Load user configuration history',
    LoadUserConfigurationHistorySuccess = '[user-config] Load user configuration history success',
    GetUserConfigurationFromHistory = '[user-config] Get user configuration from history'
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
    | LoadUserConfigurationHistoryAction
    | LoadUserConfigurationHistorySuccessAction
    | GetUserConfigurationFromHistoryAction
    ;
