import { Action } from '@ngrx/store';
import { UserConfiguration, ConfigurationReply, UploadFileData } from 'uhk-common';

import {
    ApplyUserConfigurationFromFilePayload,
    UserConfigurationValue
} from '../../models';

export enum ActionTypes {
    LoadUserConfig = '[user-config] Load User Config',
    LoadConfigFromDevice = '[user-config] Load User Config from Device',
    LoadConfigFromDeviceReply = '[user-config] Load User Config from Device reply',
    LoadUserConfigSuccess = '[user-config] Load User Config Success',
    SaveUserConfigSuccess = '[user-config] Save User Config Success',
    SaveUserConfigInJsonFile = '[user-config] Save User Config in JSON file',
    SaveUserConfigInBinFile = '[user-config] Save User Config in binary file',
    LoadResetUserConfiguration = '[user-config] Load reset user configuration',
    RenameUserConfiguration = '[user-config] Rename user configuration',
    SetUserConfigurationValue = '[user-config] Set user configuration value',
    LoadUserConfigurationFromFile = '[user-config] Load user configuration from file',
    ApplyUserConfigurationFromFile = '[user-config] Apply user configuration from file'
}

export class LoadUserConfigAction implements Action {
    type = ActionTypes.LoadUserConfig;
}

export class LoadConfigFromDeviceAction implements Action {
    type = ActionTypes.LoadConfigFromDevice;
}

export class LoadConfigFromDeviceReplyAction implements Action {
    type = ActionTypes.LoadConfigFromDeviceReply;

    constructor(public payload: ConfigurationReply) {
    }
}

export class LoadUserConfigSuccessAction implements Action {
    type = ActionTypes.LoadUserConfigSuccess;

    constructor(public payload: UserConfiguration) {
    }
}

export class SaveUserConfigSuccessAction implements Action {
    type = ActionTypes.SaveUserConfigSuccess;

    constructor(public payload: UserConfiguration) {
    }
}

export class SaveUserConfigInJsonFileAction implements Action {
    type = ActionTypes.SaveUserConfigInJsonFile;
}

export class SaveUserConfigInBinaryFileAction implements Action {
    type = ActionTypes.SaveUserConfigInBinFile;
}

export class LoadResetUserConfigurationAction implements Action {
    type = ActionTypes.LoadResetUserConfiguration;

    constructor(public payload: UserConfiguration) {
    }
}

export class RenameUserConfigurationAction implements Action {
    type = ActionTypes.RenameUserConfiguration;

    constructor(public payload: string) {
    }
}

export class SetUserConfigurationValueAction implements Action {
    type = ActionTypes.SetUserConfigurationValue;

    constructor(public payload: UserConfigurationValue) {
    }
}

export class LoadUserConfigurationFromFileAction implements Action {
    type = ActionTypes.LoadUserConfigurationFromFile;

    constructor(public payload: UploadFileData) {
    }
}

export class ApplyUserConfigurationFromFileAction implements Action {
    type = ActionTypes.ApplyUserConfigurationFromFile;

    constructor(public payload: ApplyUserConfigurationFromFilePayload) {
    }
}

export type Actions
    = LoadUserConfigAction
    | LoadUserConfigSuccessAction
    | SaveUserConfigSuccessAction
    | LoadConfigFromDeviceAction
    | LoadConfigFromDeviceReplyAction
    | SaveUserConfigInJsonFileAction
    | SaveUserConfigInBinaryFileAction
    | LoadResetUserConfigurationAction
    | RenameUserConfigurationAction
    | SetUserConfigurationValueAction
    | LoadUserConfigurationFromFileAction
    | ApplyUserConfigurationFromFileAction
    ;
