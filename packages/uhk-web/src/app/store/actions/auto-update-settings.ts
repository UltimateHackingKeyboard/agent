import { Action } from '@ngrx/store';

import { type } from 'uhk-common';
import { AutoUpdateSettings } from '../../models/auto-update-settings';

const PREFIX = '[app-update-config] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    TOGGLE_CHECK_FOR_UPDATE_ON_STARTUP: type(PREFIX + 'Check for update on startup'),
    CHECK_FOR_UPDATE_NOW: type(PREFIX + 'Check for update now'),
    CHECK_FOR_UPDATE_SUCCESS: type(PREFIX + 'Check for update success'),
    CHECK_FOR_UPDATE_FAILED: type(PREFIX + 'Check for update faild'),
    TOGGLE_PRE_RELEASE_FLAG: type(PREFIX + 'Toggle pre release update flag'),
    LOAD_AUTO_UPDATE_SETTINGS: type(PREFIX + 'Load auto update settings'),
    LOAD_AUTO_UPDATE_SETTINGS_SUCCESS: type(PREFIX + 'Load auto update settings success'),
    SAVE_AUTO_UPDATE_SETTINGS_SUCCESS: type(PREFIX + 'Save auto update settings success')
};

export class ToggleCheckForUpdateOnStartupAction implements Action {
    type = ActionTypes.TOGGLE_CHECK_FOR_UPDATE_ON_STARTUP;

    constructor(public payload: boolean) {}
}

export class CheckForUpdateNowAction implements Action {
    type = ActionTypes.CHECK_FOR_UPDATE_NOW;
}

export class CheckForUpdateSuccessAction implements Action {
    type = ActionTypes.CHECK_FOR_UPDATE_SUCCESS;
    constructor(public payload?: string) {}
}

export class CheckForUpdateFailedAction implements Action {
    type = ActionTypes.CHECK_FOR_UPDATE_FAILED;

    constructor(public payload: any) {}
}

export class TogglePreReleaseFlagAction implements Action {
    type = ActionTypes.TOGGLE_PRE_RELEASE_FLAG;

    constructor(public payload: boolean) {}
}

export class LoadAutoUpdateSettingsAction implements Action {
    type = ActionTypes.LOAD_AUTO_UPDATE_SETTINGS_SUCCESS;
}

export class LoadAutoUpdateSettingsSuccessAction implements Action {
    type = ActionTypes.LOAD_AUTO_UPDATE_SETTINGS_SUCCESS;

    constructor(public payload: AutoUpdateSettings) {}
}

export class SaveAutoUpdateSettingsSuccessAction implements Action {
    type = ActionTypes.SAVE_AUTO_UPDATE_SETTINGS_SUCCESS;
}

export type Actions =
    | ToggleCheckForUpdateOnStartupAction
    | CheckForUpdateNowAction
    | CheckForUpdateSuccessAction
    | CheckForUpdateFailedAction
    | TogglePreReleaseFlagAction
    | LoadAutoUpdateSettingsAction
    | LoadAutoUpdateSettingsSuccessAction
    | SaveAutoUpdateSettingsSuccessAction;
