export enum ModuleFirmwareUpgradeSkipReason {
    /**
     * The actually running firmware checksum of the right half or the dongle is matching with the firmware tarball checksum.
     */
    DeviceChecksumMatches = 'DeviceChecksumMatches',
    /**
     * The actually running firmware checksum of the module is matching with the expected firmware checksum by right half device.
     */
    ModuleChecksumMatches = 'ModuleChecksumMatches',
    /**
     * The module does not support the firmware upgrade like touchpad.
     */
    NotSupported = 'NotSupported',
    /**
     * UHK 80 currently does not support the firmware upgrades of the modules.
     */
    Uhk80Limitation = 'Uhk80Limitation',
}

export interface ModuleFirmwareUpgradeSkipInfo {
    moduleName: string;
    newFirmwareChecksum: string;
    reason: ModuleFirmwareUpgradeSkipReason;
}
