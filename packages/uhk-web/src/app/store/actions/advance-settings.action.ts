import { Action } from '@ngrx/store';

export enum ActionTypes {
    i2cWatchdogCounterChanged = '[advanceSettings] i2c watchdog counter changed',
    startLeftHalfPairing = '[advanceSettings] start left half pairing',
    leftHalfPairingSuccess = '[advanceSettings] left half pairing success',
    leftHalfPairingFailed = '[advanceSettings] left half pairing failed',
    toggleI2CDebugging = '[advanceSettings] toggle I2c debugging',
    toggleI2CDebuggingRingBell = '[advanceSettings] toggle I2c debugging ring bell',
    showAdvancedSettingsMenu = '[advanceSettings] show menu',
}

export class I2cWatchdogCounterChangedAction implements Action {
    type = ActionTypes.i2cWatchdogCounterChanged;

    constructor(public counter: number) {}
}

export class ToggleI2cDebuggingAction implements Action {
    type = ActionTypes.toggleI2CDebugging;
}

export class ToggleI2cDebuggingRingBellAction implements Action {
    type = ActionTypes.toggleI2CDebuggingRingBell;
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

export type Actions =
    I2cWatchdogCounterChangedAction
    | ToggleI2cDebuggingAction
    | ToggleI2cDebuggingRingBellAction
    | ShowAdvancedSettingsMenuAction
    | StartLeftHalfPairingAction
    | LeftHalfPairingSuccessAction
    | LeftHalfPairingFailedAction
    ;
