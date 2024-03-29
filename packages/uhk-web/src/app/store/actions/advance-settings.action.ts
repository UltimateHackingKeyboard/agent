import { Action } from '@ngrx/store';

export enum ActionTypes {
    i2cWatchdogCounterChanged = '[advanceSettings] i2c watchdog counter changed',
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


export class ShowAdvancedSettingsMenuAction implements Action {
    type = ActionTypes.showAdvancedSettingsMenu;
}

export type Actions =
    I2cWatchdogCounterChangedAction
    | ToggleI2cDebuggingAction
    | ToggleI2cDebuggingRingBellAction
    | ShowAdvancedSettingsMenuAction
    ;
