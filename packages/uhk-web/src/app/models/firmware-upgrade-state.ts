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
    forceUpgraded: boolean;
    isOfficialFirmware?: boolean;
    gitRepo?: string;
    gitTag?: string;
    moduleName: string;
    currentFirmwareChecksum: string;
    currentFirmwareVersion: string;
    newFirmwareVersion?: string;
    newFirmwareChecksum?: string;
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
