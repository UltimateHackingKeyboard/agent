import { Action } from '@ngrx/store';
import { RgbColor } from 'colord';
import { UserConfiguration, ConfigurationReply } from 'uhk-common';

import {
    ApplyUserConfigurationFromFilePayload,
    ModifyColorOfBacklightingColorPalettePayload,
    UserConfigurationRgbValue,
    UserConfigurationValue,
    LoadUserConfigurationFromFilePayload,
    SetModuleConfigurationValuePayload
} from '../../models';

export enum ActionTypes {
    AddColorToBacklightingColorPalette = '[user-config] Add color to the backlighting color palette',
    DeleteColorFromBacklightingColorPalette = '[user-config] delete color from the backlighting color palette',
    LoadUserConfig = '[user-config] Load User Config',
    LoadConfigFromDevice = '[user-config] Load User Config from Device',
    LoadConfigFromDeviceReply = '[user-config] Load User Config from Device reply',
    LoadUserConfigSuccess = '[user-config] Load User Config Success',
    ModifyColorOfBacklightingColorPalette = '[user-config] Modify color of the backlighting color palette',
    NavigateToModuleSettings = '[user-config] Navigate to module settings',
    SaveUserConfigSuccess = '[user-config] Save User Config Success',
    SaveUserConfigInJsonFile = '[user-config] Save User Config in JSON file',
    SaveUserConfigInBinFile = '[user-config] Save User Config in binary file',
    ToggleColorFromBacklightingColorPalette = '[user-config] toggle color from the backlighting color palette',
    LoadResetUserConfiguration = '[user-config] Load reset user configuration',
    RenameUserConfiguration = '[user-config] Rename user configuration',
    SelectModuleConfiguration = '[user-config] Select module configuration',
    SetModuleConfigurationValue = '[user-config] Set module configuration value',
    SetUserConfigurationRgbValue = '[user-config] Set user configuration RGB value',
    SetUserConfigurationValue = '[user-config] Set user configuration value',
    LoadUserConfigurationFromFile = '[user-config] Load user configuration from file',
    ApplyUserConfigurationFromFile = '[user-config] Apply user configuration from file',
    PreviewUserConfiguration = '[user-config] Preview user configuration',
    RecoverLEDSpaces = '[user-config] recover LED spaces',
}

export class AddColorToBacklightingColorPaletteAction implements Action {
    type = ActionTypes.AddColorToBacklightingColorPalette;

    constructor(public payload: RgbColor) {
    }
}

export class DeleteColorFromBacklightingColorPaletteAction implements Action {
    type = ActionTypes.DeleteColorFromBacklightingColorPalette;
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

export class ModifyColorOfBacklightingColorPaletteAction implements Action {
    type = ActionTypes.ModifyColorOfBacklightingColorPalette;

    constructor(public payload: ModifyColorOfBacklightingColorPalettePayload) {
    }
}

export class NavigateToModuleSettings implements Action {
    type = ActionTypes.NavigateToModuleSettings;

    constructor(public payload: number) {
    }
}

export class PreviewUserConfigurationAction implements Action {
    type = ActionTypes.PreviewUserConfiguration;

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

export class ToggleColorFromBacklightingColorPaletteAction implements Action {
    type = ActionTypes.ToggleColorFromBacklightingColorPalette;

    /**
     * @param payload - The index of the color from the palette
     */
    constructor(public payload: number) {
    }
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

export class SelectModuleConfigurationAction implements Action {
    type = ActionTypes.SelectModuleConfiguration;

    constructor(public payload: number) {
    }
}

export class SetModuleConfigurationValueAction implements Action {
    type = ActionTypes.SetModuleConfigurationValue;

    constructor(public payload: SetModuleConfigurationValuePayload) {
    }
}

export class SetUserConfigurationRgbValueAction implements Action {
    type = ActionTypes.SetUserConfigurationRgbValue;

    constructor(public payload: UserConfigurationRgbValue) {
    }
}

export class SetUserConfigurationValueAction implements Action {
    type = ActionTypes.SetUserConfigurationValue;

    constructor(public payload: UserConfigurationValue) {
    }
}

export class LoadUserConfigurationFromFileAction implements Action {
    type = ActionTypes.LoadUserConfigurationFromFile;

    constructor(public payload: LoadUserConfigurationFromFilePayload) {
    }
}

export class ApplyUserConfigurationFromFileAction implements Action {
    type = ActionTypes.ApplyUserConfigurationFromFile;

    constructor(public payload: ApplyUserConfigurationFromFilePayload) {
    }
}

export class RecoverLEDSpacesAction implements Action {
    type = ActionTypes.RecoverLEDSpaces;
}

export type Actions
    = AddColorToBacklightingColorPaletteAction
    | DeleteColorFromBacklightingColorPaletteAction
    | LoadUserConfigAction
    | LoadUserConfigSuccessAction
    | SaveUserConfigSuccessAction
    | LoadConfigFromDeviceAction
    | LoadConfigFromDeviceReplyAction
    | ModifyColorOfBacklightingColorPaletteAction
    | NavigateToModuleSettings
    | SaveUserConfigInJsonFileAction
    | SaveUserConfigInBinaryFileAction
    | LoadResetUserConfigurationAction
    | PreviewUserConfigurationAction
    | RenameUserConfigurationAction
    | SelectModuleConfigurationAction
    | SetModuleConfigurationValueAction
    | SetUserConfigurationRgbValueAction
    | SetUserConfigurationValueAction
    | ToggleColorFromBacklightingColorPaletteAction
    | LoadUserConfigurationFromFileAction
    | ApplyUserConfigurationFromFileAction
    | RecoverLEDSpacesAction
    ;
