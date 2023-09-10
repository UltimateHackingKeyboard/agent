import { Action } from '@ngrx/store';
import {
    BackupUserConfiguration,
    ChangeKeyboardLayoutIpcResponse,
    ConfigSizesInfo,
    DeviceConnectionState,
    FirmwareJson,
    FirmwareUpgradeFailReason,
    FirmwareUpgradeIpcResponse,
    HardwareModules,
    IpcResponse,
    KeyboardLayout
} from 'uhk-common';
import { FirmwareUpgradeError } from '../../models/firmware-upgrade-error';
import { UpdateFirmwareWithPayload } from '../../models';
import { UpdateFirmwareSuccessPayload } from '../../models/update-firmware-success-payload';

export enum ActionTypes {
    ChangeKeyboardLayout = '[device] change keyboard layout',
    ChangeKeyboardLayoutReply = '[device] change keyboard layout reply',
    SetPrivilegeOnLinux = '[device] set privilege on linux',
    SetPrivilegeOnLinuxReply = '[device] set privilege on linux reply',
    ConnectionStateChanged = '[device] connection state changed',
    SaveConfiguration = '[device] save configuration',
    SaveConfigurationReply = '[device] save configuration reply',
    SavingConfiguration = '[device] saving configuration', // TODO: Delete looks like not used
    ShowSaveToKeyboardButton = '[device] show save to keyboard button',
    SaveToKeyboardSuccess = '[device] save to keyboard success',
    SaveToKeyboardFailed = '[device] save to keyboard failed',
    HideSaveToKeyboardButton = '[device] hide save to keyboard button',
    ResetUserConfiguration = '[device] reset user configuration',
    ResetPcMouseSpeedSettings = '[device] reset PC mouse speed settings',
    ResetMacMouseSpeedSettings = '[device] reset Mac mouse speed settings',
    CurrentlyUpdateSkipModule = '[device] currently update skip module',
    CurrentlyUpdatingModule = '[device] currently updating module',
    UpdateFirmware = '[device] update firmware',
    UpdateFirmwareJson = '[device] update firmware JSON',
    UpdateFirmwareWith = '[device] update firmware with',
    UpdateFirmwareReply = '[device] update firmware reply',
    UpdateFirmwareSuccess = '[device] update firmware success',
    UpdateFirmwareFailed = '[device] update firmware failed',
    UpdateFirmwareNotSupported= '[device] update firmware not supported',
    ModulesInfoLoaded = '[device] module info loaded',
    BackupUserConfiguration = '[device] Stored backup user configuration',
    RestoreConfigurationFromBackup = '[device] Restore configuration from backup',
    RestoreConfigurationFromBackupSuccess = '[device] Restore configuration from backup success',
    RecoveryDevice = '[device] Recovery device',
    RecoveryDeviceReply = '[device] Recovery device reply',
    RecoveryModule = '[device] Recovery module',
    RecoveryModuleReply = '[device] Recovery module reply',
    EnableUsbStackTest = '[device] USB stack test',
    StartConnectionPoller = '[device] Start connection poller',
    StatusBufferChanged = '[device] Status buffer changed',
    ReadConfigSizes = '[device] Read config sizes',
    ReadConfigSizesReply = '[device] Read config sizes reply',
    SkipFirmwareUpgrade = '[device] Skip firmware upgrade'
}

export class ChangeKeyboardLayoutAction implements Action {
    type = ActionTypes.ChangeKeyboardLayout;

    constructor(public layout: KeyboardLayout) {}
}

export class ChangeKeyboardLayoutReplyAction implements Action {
    type = ActionTypes.ChangeKeyboardLayoutReply;

    constructor(public payload: ChangeKeyboardLayoutIpcResponse) {}
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

export class CurrentlyUpdatingModuleAction implements Action {
    type = ActionTypes.CurrentlyUpdatingModule;

    constructor(public payload: string) {
    }
}

export class CurrentlyUpdateSkipModuleAction implements Action {
    type = ActionTypes.CurrentlyUpdateSkipModule;

    constructor(public payload: string) {
    }
}

export class UpdateFirmwareAction implements Action {
    type = ActionTypes.UpdateFirmware;

    constructor(public payload: boolean) {
    }
}

export class UpdateFirmwareJsonAction implements Action {
    type = ActionTypes.UpdateFirmwareJson;

    constructor(public payload: FirmwareJson) {
    }
}

export class UpdateFirmwareWithAction implements Action {
    type = ActionTypes.UpdateFirmwareWith;

    constructor(public payload: UpdateFirmwareWithPayload) {
    }
}

export class UpdateFirmwareReplyAction implements Action {
    type = ActionTypes.UpdateFirmwareReply;

    constructor(public payload: FirmwareUpgradeIpcResponse) {
    }
}

export class UpdateFirmwareSuccessAction implements Action {
    type = ActionTypes.UpdateFirmwareSuccess;

    constructor(public payload: UpdateFirmwareSuccessPayload) {
    }
}

export class UpdateFirmwareFailedAction implements Action {
    type = ActionTypes.UpdateFirmwareFailed;

    constructor(public payload: FirmwareUpgradeError) {
    }
}

export class UpdateFirmwareNotSupportedAction implements Action {
    type = ActionTypes.UpdateFirmwareNotSupported;

    constructor(public payload: FirmwareUpgradeFailReason) {
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

export class BackupUserConfigurationAction implements Action {
    type = ActionTypes.BackupUserConfiguration;

    constructor(public payload: BackupUserConfiguration) {
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

export class RecoveryModuleAction implements Action {
    type = ActionTypes.RecoveryModule;

    /**
     * @param payload - moduleId
     */
    constructor(public payload: number) {
    }
}

export class RecoveryModuleReplyAction implements Action {
    type = ActionTypes.RecoveryModuleReply;

    constructor(public payload: FirmwareUpgradeIpcResponse) {
    }
}

export class EnableUsbStackTestAction implements Action {
    type = ActionTypes.EnableUsbStackTest;
}

export class StartConnectionPollerAction implements Action {
    type = ActionTypes.StartConnectionPoller;
}

export class StatusBufferChangedAction implements Action {
    type = ActionTypes.StatusBufferChanged;

    constructor(public payload: string) {}
}

export class ReadConfigSizesAction implements Action {
    type = ActionTypes.ReadConfigSizes;
}

export class ReadConfigSizesReplyAction implements Action {
    type = ActionTypes.ReadConfigSizesReply;

    constructor(public payload: ConfigSizesInfo) {
    }
}

export class SkipFirmwareUpgradeAction implements Action {
    type = ActionTypes.SkipFirmwareUpgrade;
}

export type Actions
    = ChangeKeyboardLayoutAction
    | ChangeKeyboardLayoutReplyAction
    | SetPrivilegeOnLinuxAction
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
    | CurrentlyUpdateSkipModuleAction
    | CurrentlyUpdatingModuleAction
    | UpdateFirmwareAction
    | UpdateFirmwareJsonAction
    | UpdateFirmwareWithAction
    | UpdateFirmwareReplyAction
    | UpdateFirmwareSuccessAction
    | UpdateFirmwareFailedAction
    | UpdateFirmwareNotSupportedAction
    | HardwareModulesLoadedAction
    | RestoreUserConfigurationFromBackupAction
    | BackupUserConfigurationAction
    | RestoreUserConfigurationFromBackupSuccessAction
    | RecoveryDeviceAction
    | RecoveryDeviceReplyAction
    | RecoveryModuleAction
    | EnableUsbStackTestAction
    | StartConnectionPollerAction
    | StatusBufferChangedAction
    | ReadConfigSizesAction
    | ReadConfigSizesReplyAction
    | SkipFirmwareUpgradeAction
    ;
