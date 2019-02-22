import { Action } from '@ngrx/store';

import { AutoUpdateSettings } from 'uhk-common';

export enum ActionTypes {
    ToggleCheckForUpdateOnStartup = '[app-update-config] Check for update on startup',
    CheckForUpdateNow = '[app-update-config] Check for update now',
    CheckForUpdateSuccess = '[app-update-config] Check for update success',
    CheckForUpdateFailed = '[app-update-config] Check for update failed',
    TogglePreReleaseFlag = '[app-update-config] Toggle pre release update flag',
    LoadAutoUpdateSettings = '[app-update-config] Load auto update settings',
    LoadAutoUpdateSettingSuccess = '[app-update-config] Load auto update settings success',
    SaveAutoUpdateSettingSuccess = '[app-update-config] Save auto update settings success'
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

export class TogglePreReleaseFlagAction implements Action {
    type = ActionTypes.TogglePreReleaseFlag;

    constructor(public payload: boolean) {
    }
}

export class LoadAutoUpdateSettingsAction implements Action {
    type = ActionTypes.LoadAutoUpdateSettingSuccess;
}

export class LoadAutoUpdateSettingsSuccessAction implements Action {
    type = ActionTypes.LoadAutoUpdateSettingSuccess;

    constructor(public payload: AutoUpdateSettings) {
    }
}

export class SaveAutoUpdateSettingsSuccessAction implements Action {
    type = ActionTypes.SaveAutoUpdateSettingSuccess;
}

export type Actions
    = ToggleCheckForUpdateOnStartupAction
    | CheckForUpdateNowAction
    | CheckForUpdateSuccessAction
    | CheckForUpdateFailedAction
    | TogglePreReleaseFlagAction
    | LoadAutoUpdateSettingsAction
    | LoadAutoUpdateSettingsSuccessAction
    | SaveAutoUpdateSettingsSuccessAction;
