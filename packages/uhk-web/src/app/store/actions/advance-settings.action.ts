import { Action } from '@ngrx/store';
import { ZephyrLogEntry } from 'uhk-common';

export enum ActionTypes {
    i2cWatchdogCounterChanged = '[advanceSettings] i2c watchdog counter changed',
    isDongleZephyrLoggingEnabled = '[advanceSettings] is dongle zephyr logging enabled',
    isDongleZephyrLoggingEnabledReply = '[advanceSettings] is dongle zephyr logging enabled reply',
    isLeftHalfZephyrLoggingEnabled = '[advanceSettings] is left half zephyr logging enabled',
    isLeftHalfZephyrLoggingEnabledReply = '[advanceSettings] is left half zephyr logging enabled reply',
    isRightHalfZephyrLoggingEnabled = '[advanceSettings] is right half zephyr logging enabled',
    isRightHalfZephyrLoggingEnabledReply = '[advanceSettings] is right half zephyr logging enabled reply',
    startLeftHalfPairing = '[advanceSettings] start left half pairing',
    leftHalfPairingSuccess = '[advanceSettings] left half pairing success',
    leftHalfPairingFailed = '[advanceSettings] left half pairing failed',
    toggleI2CDebugging = '[advanceSettings] toggle I2c debugging',
    toggleI2CDebuggingRingBell = '[advanceSettings] toggle I2c debugging ring bell',
    toggleDongleZephyrLogging = '[advanceSettings] toggle left dongle zephyr logging',
    toggleLeftHalfZephyrLogging = '[advanceSettings] toggle left half zephyr logging',
    toggleRightHalfZephyrLogging = '[advanceSettings] toggle right half zephyr logging',
    toggleZephyrLogging = '[advanceSettings] toggle zephyr logging',
    showAdvancedSettingsMenu = '[advanceSettings] show menu',
    zephyrLog = '[advanceSettings] zephyr log',
}

export class I2cWatchdogCounterChangedAction implements Action {
    type = ActionTypes.i2cWatchdogCounterChanged;

    constructor(public counter: number) {}
}

export class IsDongleZephyrLoggingEnabledAction implements Action {
    type = ActionTypes.isDongleZephyrLoggingEnabled;
}

export class IsDongleZephyrLoggingEnabledReplyAction implements Action {
    type = ActionTypes.isDongleZephyrLoggingEnabledReply;

    constructor(public enabled: boolean) {}
}

export class IsLeftHalfZephyrLoggingEnabledAction implements Action {
    type = ActionTypes.isLeftHalfZephyrLoggingEnabled;
}

export class IsLeftHalfZephyrLoggingEnabledReplyAction implements Action {
    type = ActionTypes.isLeftHalfZephyrLoggingEnabledReply;

    constructor(public enabled: boolean) {}
}

export class IsRightHalfZephyrLoggingEnabledAction implements Action {
    type = ActionTypes.isRightHalfZephyrLoggingEnabled;
}

export class IsRightHalfZephyrLoggingEnabledReplyAction implements Action {
    type = ActionTypes.isRightHalfZephyrLoggingEnabledReply;

    constructor(public enabled: boolean) {}
}

export class ToggleI2cDebuggingAction implements Action {
    type = ActionTypes.toggleI2CDebugging;
}

export class ToggleI2cDebuggingRingBellAction implements Action {
    type = ActionTypes.toggleI2CDebuggingRingBell;
}

export class ToggleDongleZephyrLoggingAction implements Action {
    type = ActionTypes.toggleDongleZephyrLogging;
}

export class ToggleLeftHalfZephyrLoggingAction implements Action {
    type = ActionTypes.toggleLeftHalfZephyrLogging;
}

export class ToggleRightHalfZephyrLoggingAction implements Action {
    type = ActionTypes.toggleRightHalfZephyrLogging;
}

export class ToggleZephyrLoggingAction implements Action {
    type = ActionTypes.toggleZephyrLogging;
}

export class StartLeftHalfPairingAction implements Action {
    type = ActionTypes.startLeftHalfPairing;
}

export class LeftHalfPairingSuccessAction implements Action {
    type = ActionTypes.leftHalfPairingSuccess;

    // the payload is the left half BLE Address
    constructor(public payload: string) {}
}

export class LeftHalfPairingFailedAction implements Action {
    type = ActionTypes.leftHalfPairingFailed;

    constructor(public payload: string) {}
}

export class ShowAdvancedSettingsMenuAction implements Action {
    type = ActionTypes.showAdvancedSettingsMenu;
}

export class ZephyrLogAction implements Action {
    type = ActionTypes.zephyrLog;

    constructor(public payload: ZephyrLogEntry) {}
}

export type Actions =
    I2cWatchdogCounterChangedAction
    | IsDongleZephyrLoggingEnabledAction
    | IsDongleZephyrLoggingEnabledReplyAction
    | IsLeftHalfZephyrLoggingEnabledAction
    | IsLeftHalfZephyrLoggingEnabledReplyAction
    | IsRightHalfZephyrLoggingEnabledAction
    | IsRightHalfZephyrLoggingEnabledReplyAction
    | ToggleI2cDebuggingAction
    | ToggleI2cDebuggingRingBellAction
    | ToggleDongleZephyrLoggingAction
    | ToggleLeftHalfZephyrLoggingAction
    | ToggleRightHalfZephyrLoggingAction
    | ToggleZephyrLoggingAction
    | ShowAdvancedSettingsMenuAction
    | StartLeftHalfPairingAction
    | LeftHalfPairingSuccessAction
    | LeftHalfPairingFailedAction
    | ZephyrLogAction
    ;
