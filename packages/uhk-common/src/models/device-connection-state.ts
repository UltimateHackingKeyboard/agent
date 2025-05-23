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
    isZephyrLogAvailable: boolean;
    leftHalfDetected: boolean;
    /**
     * True if more than 1 UHK device connected.
     */
    multiDevice: boolean;
    communicationInterfaceAvailable: boolean;
    halvesInfo: HalvesInfo;
    hardwareModules?: HardwareModules;
    /**
     * The BLE addresses of the devices that paired with the keyboard but not is the hostConnections of the user configuration.
     */
    newPairedDevices: string[];
    udevRulesInfo: UdevRulesInfo;
}
