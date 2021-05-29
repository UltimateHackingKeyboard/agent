import { UhkModule } from 'uhk-common';

export enum ModuleFirmwareUpgradeStates {
    Idle = 'Idle',
    Upgrading = 'Upgrading',
    Success = 'Success',
    Failed = 'Failed'
}

export interface ModuleFirmwareUpgradeState {
    firmwareUpgradeSupported: boolean;
    moduleName: string;
    currentFirmwareVersion: string;
    newFirmwareVersion?: string;
    state: ModuleFirmwareUpgradeStates;
}

export interface FirmwareUpgradeState {
    modules: Array<ModuleFirmwareUpgradeState>;
    recoveryModules: Array<UhkModule>;
    showForceFirmwareUpgrade: boolean;
    showForceFirmwareUpgradeWith: boolean;
}
