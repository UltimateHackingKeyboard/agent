import { Dongle } from './dongle.js';
import { HalvesInfo } from './halves-info.js';
import { HardwareModules } from './hardware-modules.js';
import { UdevRulesInfo } from './udev-rules-info.js';
import { UhkDeviceProduct } from './uhk-products.js';

export interface DeviceConnectionState {
    bleAddress?: string;
    // UHK80 connected via bluetooth
    bleDeviceConnected: boolean;
    isPairedWithDongle?: boolean;
    connectedDevice?: UhkDeviceProduct;
    dongle: Dongle;
    leftHalfBootloaderActive: boolean;
    hasPermission: boolean;
    bootloaderActive: boolean;
    isMacroStatusDirty: boolean;
    leftHalfDetected: boolean;
    /**
     * True if more than 1 UHK device connected.
     */
    multiDevice: boolean;
    communicationInterfaceAvailable: boolean;
    halvesInfo: HalvesInfo;
    hardwareModules?: HardwareModules;
    /**
     * Each element describe the hostConnection is the user-config are paired to the keyboard or not.
     * If the value is 1 then paired.
     */
    pairedDevices: number[];
    udevRulesInfo: UdevRulesInfo;
}
