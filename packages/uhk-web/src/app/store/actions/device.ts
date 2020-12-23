import { Action } from '@ngrx/store';
import {
    ConfigSizesInfo,
    DeviceConnectionState,
    FirmwareUpgradeIpcResponse,
    HardwareModules,
    IpcResponse,
    UploadFileData
} from 'uhk-common';
import { FirmwareUpgradeError } from '../../models/firmware-upgrade-error';

export enum ActionTypes {
    SetPrivilegeOnLinux = '[device] set privilege on linux',
    SetPrivilegeOnLinuxReply = '[device] set privilege on linux reply',
    ConnectionStateChanged = '[device] connection state changed',
    SaveConfiguration = '[device] save configuration',
    SaveConfigurationReply = '[device] save configuration reply',
    SavingConfiguration = '[device] saving configuration',
    ShowSaveToKeyboardButton = '[device] show save to keyboard button',
    SaveToKeyboardSuccess = '[device] save to keyboard success',
    SaveToKeyboardFailed = '[device] save to keyboard failed',
    HideSaveToKeyboardButton = '[device] hide save to keyboard button',
    ResetUserConfiguration = '[device] reset user configuration',
    ResetPcMouseSpeedSettings = '[device] reset PC mouse speed settings',
    ResetMacMouseSpeedSettings = '[device] reset Mac mouse speed settings',
    UpdateFirmware = '[device] update firmware',
    UpdateFirmwareWith = '[device] update firmware with',
    UpdateFirmwareReply = '[device] update firmware reply',
    UpdateFirmwareSuccess = '[device] update firmware success',
    UpdateFirmwareFailed = '[device] update firmware failed',
    ModulesInfoLoaded = '[device] module info loaded',
    HasBackupUserConfiguration = '[device] Store backup user configuration',
    RestoreConfigurationFromBackup = '[device] Restore configuration from backup',
    RestoreConfigurationFromBackupSuccess = '[device] Restore configuration from backup success',
    RecoveryDevice = '[device] Recovery device',
    RecoveryDeviceReply = '[device] Recovery device reply',
    EnableUsbStackTest = '[device] USB stack test',
    StartConnectionPoller = '[device] Start connection poller',
    ReadConfigSizes = '[device] Read config sizes',
    ReadConfigSizesReply = '[device] Read config sizes reply'
}

export class SetPrivilegeOnLinuxAction implements Action {
    type = ActionTypes.SetPrivilegeOnLinux;
}

export class SetPrivilegeOnLinuxReplyAction implements Action {
    type = ActionTypes.SetPrivilegeOnLinuxReply;

    constructor(public payload: IpcResponse) {
    }
}

export class ConnectionStateChangedAction implements Action {
    type = ActionTypes.ConnectionStateChanged;

    constructor(public payload: DeviceConnectionState) {
    }
}

export class SaveConfigurationAction implements Action {
    type = ActionTypes.SaveConfiguration;

    /**
     * @param payload - if true then save user configuration in the history
     */
    constructor(public payload: boolean) {
    }
}

export class SaveConfigurationReplyAction implements Action {
    type = ActionTypes.SaveConfigurationReply;

    constructor(public payload: IpcResponse) {
    }
}

export class ShowSaveToKeyboardButtonAction implements Action {
    type = ActionTypes.ShowSaveToKeyboardButton;
}

export class SaveToKeyboardSuccessAction implements Action {
    type = ActionTypes.SaveToKeyboardSuccess;
}

export class SaveToKeyboardSuccessFailed implements Action {
    type = ActionTypes.SaveToKeyboardFailed;
}

export class HideSaveToKeyboardButton implements Action {
    type = ActionTypes.HideSaveToKeyboardButton;
}

export class ResetUserConfigurationAction implements Action {
    type = ActionTypes.ResetUserConfiguration;
}

export class UpdateFirmwareAction implements Action {
    type = ActionTypes.UpdateFirmware;
}

export class UpdateFirmwareWithAction implements Action {
    type = ActionTypes.UpdateFirmwareWith;

    constructor(public payload: UploadFileData) {
    }
}

export class UpdateFirmwareReplyAction implements Action {
    type = ActionTypes.UpdateFirmwareReply;

    constructor(public payload: FirmwareUpgradeIpcResponse) {
    }
}

export class UpdateFirmwareSuccessAction implements Action {
    type = ActionTypes.UpdateFirmwareSuccess;

    constructor(public payload: HardwareModules) {
    }
}

export class UpdateFirmwareFailedAction implements Action {
    type = ActionTypes.UpdateFirmwareFailed;

    constructor(public payload: FirmwareUpgradeError) {
    }
}

export class ResetPcMouseSpeedSettingsAction implements Action {
    type = ActionTypes.ResetPcMouseSpeedSettings;
}

export class ResetMacMouseSpeedSettingsAction implements Action {
    type = ActionTypes.ResetMacMouseSpeedSettings;
}

export class HardwareModulesLoadedAction implements Action {
    type = ActionTypes.ModulesInfoLoaded;

    constructor(public payload: HardwareModules) {
    }
}

export class RestoreUserConfigurationFromBackupAction implements Action {
    type = ActionTypes.RestoreConfigurationFromBackup;
}

export class HasBackupUserConfigurationAction implements Action {
    type = ActionTypes.HasBackupUserConfiguration;

    constructor(public payload: boolean) {
    }
}

export class RestoreUserConfigurationFromBackupSuccessAction implements Action {
    type = ActionTypes.RestoreConfigurationFromBackupSuccess;
}

export class RecoveryDeviceAction implements Action {
    type = ActionTypes.RecoveryDevice;
}

export class RecoveryDeviceReplyAction implements Action {
    type = ActionTypes.RecoveryDeviceReply;

    constructor(public payload: FirmwareUpgradeIpcResponse) {
    }
}

export class EnableUsbStackTestAction implements Action {
    type = ActionTypes.EnableUsbStackTest;
}

export class StartConnectionPollerAction implements Action {
    type = ActionTypes.StartConnectionPoller;
}

export class ReadConfigSizesAction implements Action {
    type = ActionTypes.ReadConfigSizes;
}

export class ReadConfigSizesReplyAction implements Action {
    type = ActionTypes.ReadConfigSizesReply;

    constructor(public payload: ConfigSizesInfo) {
    }
}

export type Actions
    = SetPrivilegeOnLinuxAction
    | SetPrivilegeOnLinuxReplyAction
    | ConnectionStateChangedAction
    | ShowSaveToKeyboardButtonAction
    | SaveConfigurationAction
    | SaveConfigurationReplyAction
    | SaveToKeyboardSuccessAction
    | SaveToKeyboardSuccessFailed
    | HideSaveToKeyboardButton
    | ResetPcMouseSpeedSettingsAction
    | ResetMacMouseSpeedSettingsAction
    | ResetUserConfigurationAction
    | UpdateFirmwareAction
    | UpdateFirmwareWithAction
    | UpdateFirmwareReplyAction
    | UpdateFirmwareSuccessAction
    | UpdateFirmwareFailedAction
    | HardwareModulesLoadedAction
    | RestoreUserConfigurationFromBackupAction
    | HasBackupUserConfigurationAction
    | RestoreUserConfigurationFromBackupSuccessAction
    | RecoveryDeviceAction
    | RecoveryDeviceReplyAction
    | EnableUsbStackTestAction
    | StartConnectionPollerAction
    | ReadConfigSizesAction
    | ReadConfigSizesReplyAction
    ;
