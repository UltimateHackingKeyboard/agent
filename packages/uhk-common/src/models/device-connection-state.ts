import { Dongle } from './dongle.js';
import { HalvesInfo } from './halves-info.js';
import { HardwareModules } from './hardware-modules.js';
import { UdevRulesInfo } from './udev-rules-info.js';
import { UhkDeviceProduct } from './uhk-products.js';

export interface DeviceConnectionState {
    bleAddress?: string;
    isPairedWithDongle?: boolean;
    connectedDevice?: UhkDeviceProduct;
    dongle: Dongle;
    hasPermission: boolean;
    bootloaderActive: boolean;
    isMacroStatusDirty: boolean;
    /**
     * True if more than 1 UHK device connected.
     */
    multiDevice: boolean;
    communicationInterfaceAvailable: boolean;
    halvesInfo: HalvesInfo;
    hardwareModules?: HardwareModules;
    udevRulesInfo: UdevRulesInfo;
}
