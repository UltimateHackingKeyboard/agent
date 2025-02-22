import { FirmwareUpgradeFailReason, UhkModule } from 'uhk-common';

export enum ModuleFirmwareUpgradeStates {
    Idle = 'Idle',
    Upgrading = 'Upgrading',
    Skipped = 'Skipped',
    Success = 'Success',
    Failed = 'Failed'
}

export interface ModuleFirmwareUpgradeState {
    firmwareUpgradeSupported: boolean;
    isOfficialFirmware?: boolean;
    gitRepo?: string;
    gitTag?: string;
    moduleName: string;
    currentFirmwareVersion: string;
    newFirmwareVersion?: string;
    state: ModuleFirmwareUpgradeStates;
    tooltip?: string;
}

export interface FirmwareUpgradeState {
    failReason?: FirmwareUpgradeFailReason;
    modules: Array<ModuleFirmwareUpgradeState>;
    recoveryModules: Array<UhkModule>;
    showForceFirmwareUpgrade: boolean;
    showForceFirmwareUpgradeWith: boolean;
}
