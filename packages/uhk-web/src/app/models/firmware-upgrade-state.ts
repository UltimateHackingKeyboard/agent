export interface ModuleFirmwareUpgradeState {
    firmwareUpgradeSupported: boolean;
    moduleName: string;
    upgrading: boolean;
    currentFirmwareVersion: string;
    newFirmwareVersion?: string;
}

export interface FirmwareUpgradeState {
    modules: Array<ModuleFirmwareUpgradeState>;
    showForceFirmwareUpgrade: boolean;
    showForceFirmwareUpgradeWith: boolean;
}
