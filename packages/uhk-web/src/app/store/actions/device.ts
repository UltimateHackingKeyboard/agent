import { Action } from '@ngrx/store';
import { DeviceConnectionState, FirmwareUpgradeIpcResponse, HardwareModules, IpcResponse, type } from 'uhk-common';
import { FirmwareUpgradeError } from '../../models/firmware-upgrade-error';

const PREFIX = '[device] ';

// tslint:disable-next-line:variable-name
export const ActionTypes = {
    SET_PRIVILEGE_ON_LINUX: type(PREFIX + 'set privilege on linux'),
    SET_PRIVILEGE_ON_LINUX_REPLY: type(PREFIX + 'set privilege on linux reply'),
    CONNECTION_STATE_CHANGED: type(PREFIX + 'connection state changed'),
    SAVE_CONFIGURATION: type(PREFIX + 'save configuration'),
    SAVE_CONFIGURATION_REPLY: type(PREFIX + 'save configuration reply'),
    SAVING_CONFIGURATION: type(PREFIX + 'saving configuration'),
    SHOW_SAVE_TO_KEYBOARD_BUTTON: type(PREFIX + 'show save to keyboard button'),
    SAVE_TO_KEYBOARD_SUCCESS: type(PREFIX + 'save to keyboard success'),
    SAVE_TO_KEYBOARD_FAILED: type(PREFIX + 'save to keyboard failed'),
    HIDE_SAVE_TO_KEYBOARD_BUTTON: type(PREFIX + 'hide save to keyboard button'),
    RESET_USER_CONFIGURATION: type(PREFIX + 'reset user configuration'),
    RESET_MOUSE_SPEED_SETTINGS: type(PREFIX + 'reset mouse speed settings'),
    UPDATE_FIRMWARE: type(PREFIX + 'update firmware'),
    UPDATE_FIRMWARE_WITH: type(PREFIX + 'update firmware with'),
    UPDATE_FIRMWARE_REPLY: type(PREFIX + 'update firmware reply'),
    UPDATE_FIRMWARE_SUCCESS: type(PREFIX + 'update firmware success'),
    UPDATE_FIRMWARE_FAILED: type(PREFIX + 'update firmware failed'),
    UPDATE_FIRMWARE_OK_BUTTON: type(PREFIX + 'update firmware ok button click'),
    MODULES_INFO_LOADED: type(PREFIX + 'module info loaded'),
    HAS_BACKUP_USER_CONFIGURATION: type(PREFIX + 'Store backup user configuration'),
    RESTORE_CONFIGURATION_FROM_BACKUP: type(PREFIX + 'Restore configuration from backup'),
    RESTORE_CONFIGURATION_FROM_BACKUP_SUCCESS: type(PREFIX + 'Restore configuration from backup success'),
    RECOVERY_DEVICE: type(PREFIX + 'Recovery device'),
    ENABLE_USB_STACK_TEST: type(PREFIX + 'USB stack test'),
    START_CONNECTION_POLLER: type(PREFIX + 'Start connection poller')
};

export class SetPrivilegeOnLinuxAction implements Action {
    type = ActionTypes.SET_PRIVILEGE_ON_LINUX;
}

export class SetPrivilegeOnLinuxReplyAction implements Action {
    type = ActionTypes.SET_PRIVILEGE_ON_LINUX_REPLY;

    constructor(public payload: IpcResponse) {
    }
}

export class ConnectionStateChangedAction implements Action {
    type = ActionTypes.CONNECTION_STATE_CHANGED;

    constructor(public payload: DeviceConnectionState) {
    }
}

export class SaveConfigurationAction implements Action {
    type = ActionTypes.SAVE_CONFIGURATION;

    constructor() {
    }
}

export class SaveConfigurationReplyAction implements Action {
    type = ActionTypes.SAVE_CONFIGURATION_REPLY;

    constructor(public payload: IpcResponse) {
    }
}

export class ShowSaveToKeyboardButtonAction implements Action {
    type = ActionTypes.SHOW_SAVE_TO_KEYBOARD_BUTTON;
}

export class SaveToKeyboardSuccessAction implements Action {
    type = ActionTypes.SAVE_TO_KEYBOARD_SUCCESS;
}

export class SaveToKeyboardSuccessFailed implements Action {
    type = ActionTypes.SAVE_TO_KEYBOARD_FAILED;
}

export class HideSaveToKeyboardButton implements Action {
    type = ActionTypes.HIDE_SAVE_TO_KEYBOARD_BUTTON;
}

export class ResetUserConfigurationAction implements Action {
    type = ActionTypes.RESET_USER_CONFIGURATION;
}

export class UpdateFirmwareAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE;
}

export class UpdateFirmwareWithAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_WITH;

    constructor(public payload: Array<number>) {
    }
}

export class UpdateFirmwareReplyAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_REPLY;

    constructor(public payload: FirmwareUpgradeIpcResponse) {
    }
}

export class UpdateFirmwareSuccessAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_SUCCESS;

    constructor(public payload: HardwareModules) {
    }
}

export class UpdateFirmwareFailedAction implements Action {
    type = ActionTypes.UPDATE_FIRMWARE_FAILED;

    constructor(public payload: FirmwareUpgradeError) {
    }
}

export class ResetMouseSpeedSettingsAction implements Action {
    type = ActionTypes.RESET_MOUSE_SPEED_SETTINGS;
}

export class HardwareModulesLoadedAction implements Action {
    type = ActionTypes.MODULES_INFO_LOADED;

    constructor(public payload: HardwareModules) {
    }
}

export class RestoreUserConfigurationFromBackupAction implements Action {
    type = ActionTypes.RESTORE_CONFIGURATION_FROM_BACKUP;
}

export class HasBackupUserConfigurationAction implements Action {
    type = ActionTypes.HAS_BACKUP_USER_CONFIGURATION;

    constructor(public payload: boolean) {
    }
}

export class RestoreUserConfigurationFromBackupSuccessAction implements Action {
    type = ActionTypes.RESTORE_CONFIGURATION_FROM_BACKUP_SUCCESS;
}

export class RecoveryDeviceAction implements Action {
    type = ActionTypes.RECOVERY_DEVICE;
}

export class EnableUsbStackTestAction implements Action {
    type = ActionTypes.ENABLE_USB_STACK_TEST;
}

export class StartConnectionPollerAction implements Action {
    type = ActionTypes.START_CONNECTION_POLLER;
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
    | ResetMouseSpeedSettingsAction
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
    | EnableUsbStackTestAction
    | StartConnectionPollerAction
    ;
