import { Action } from '@ngrx/store';

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

    constructor(public payload: Array<string>) {
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
