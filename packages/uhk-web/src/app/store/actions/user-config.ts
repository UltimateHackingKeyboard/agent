import { Action } from '@ngrx/store';
import { RgbColor } from 'colord';
import { HostConnection, UserConfiguration, ConfigurationReply } from 'uhk-common';

import {
    ApplyUserConfigurationFromFilePayload,
    ModifyColorOfBacklightingColorPalettePayload,
    NewerUserConfiguration,
    UserConfigurationRgbValue,
    UserConfigurationValue,
    LoadUserConfigurationFromFilePayload,
    SetModuleConfigurationValuePayload
} from '../../models';
import { NavigateToModuleSettingsPayload } from '../../models/navigate-to-module-settings-payload';

export enum ActionTypes {
    AddColorToBacklightingColorPalette = '[user-config] Add color to the backlighting color palette',
    AddNewPairedDevicesToHostConnections = '[user-config] Add new paired devices to host connections',
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
    RenameHostConnection = '[user-config] Rename host connection',
    RenameUserConfiguration = '[user-config] Rename user configuration',
    ReorderHostConnections = '[user-config] Reorder host connections',
    SelectModuleConfiguration = '[user-config] Select module configuration',
    SetHostConnectionSwitchover = '[user-config] set host connection switchover',
    SetModuleConfigurationValue = '[user-config] Set module configuration value',
    SetUserConfigurationRgbValue = '[user-config] Set user configuration RGB value',
    SetUserConfigurationValue = '[user-config] Set user configuration value',
    LoadUserConfigurationFromFile = '[user-config] Load user configuration from file',
    ApplyUserConfigurationFromFile = '[user-config] Apply user configuration from file',
    PreviewUserConfiguration = '[user-config] Preview user configuration',
    RecoverLEDSpaces = '[user-config] recover LED spaces',
    UserConfigurationNewer = '[user-config] user configuration is newer that Agent support',
}

export class AddColorToBacklightingColorPaletteAction implements Action {
    type = ActionTypes.AddColorToBacklightingColorPalette;

    constructor(public payload: RgbColor) {
    }
}

export class AddNewPairedDevicesToHostConnectionsAction implements Action {
    type = ActionTypes.AddNewPairedDevicesToHostConnections;
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

    constructor(public payload: NavigateToModuleSettingsPayload) {
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

export class RenameHostConnectionAction implements Action {
    type = ActionTypes.RenameHostConnection;

    constructor(public payload: {index: number, newName: string}) {
    }
}

export class RenameUserConfigurationAction implements Action {
    type = ActionTypes.RenameUserConfiguration;

    constructor(public payload: string) {
    }
}

export class ReorderHostConnectionsAction implements Action {
    type = ActionTypes.ReorderHostConnections;

    constructor(public payload: HostConnection[]) {
    }
}


export class SelectModuleConfigurationAction implements Action {
    type = ActionTypes.SelectModuleConfiguration;

    constructor(public payload: number) {
    }
}

export class SetHostConnectionSwitchoverAction implements Action {
    type = ActionTypes.SetHostConnectionSwitchover;

    constructor(public payload: {index: number, checked: boolean}) {
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

export class UserConfigurationNewerAction implements Action {
    type = ActionTypes.UserConfigurationNewer;

    constructor(public payload?: NewerUserConfiguration) {}
}

export type Actions
    = AddColorToBacklightingColorPaletteAction
    | AddNewPairedDevicesToHostConnectionsAction
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
    | RenameHostConnectionAction
    | RenameUserConfigurationAction
    | ReorderHostConnectionsAction
    | SelectModuleConfigurationAction
    | SetHostConnectionSwitchoverAction
    | SetModuleConfigurationValueAction
    | SetUserConfigurationRgbValueAction
    | SetUserConfigurationValueAction
    | ToggleColorFromBacklightingColorPaletteAction
    | LoadUserConfigurationFromFileAction
    | ApplyUserConfigurationFromFileAction
    | RecoverLEDSpacesAction
    | UserConfigurationNewerAction
    ;
