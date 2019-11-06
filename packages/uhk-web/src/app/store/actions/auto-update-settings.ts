import { Action } from '@ngrx/store';

export enum ActionTypes {
    ToggleCheckForUpdateOnStartup = '[app-update-config] Check for update on startup',
    CheckForUpdateNow = '[app-update-config] Check for update now',
    CheckForUpdateSuccess = '[app-update-config] Check for update success',
    CheckForUpdateFailed = '[app-update-config] Check for update failed'
}

export class ToggleCheckForUpdateOnStartupAction implements Action {
    type = ActionTypes.ToggleCheckForUpdateOnStartup;

    constructor(public payload: boolean) {
    }
}

export class CheckForUpdateNowAction implements Action {
    type = ActionTypes.CheckForUpdateNow;

    constructor(public payload?: boolean) {
    }
}

export class CheckForUpdateSuccessAction implements Action {
    type = ActionTypes.CheckForUpdateSuccess;

    constructor(public payload?: string) {
    }
}

export class CheckForUpdateFailedAction implements Action {
    type = ActionTypes.CheckForUpdateFailed;

    constructor(public payload: any) {
    }
}

export type Actions
    = ToggleCheckForUpdateOnStartupAction
    | CheckForUpdateNowAction
    | CheckForUpdateSuccessAction
    | CheckForUpdateFailedAction
    ;
