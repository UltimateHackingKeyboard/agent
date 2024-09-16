import { HalvesInfo } from './halves-info.js';
import { HardwareModules } from './hardware-modules.js';
import { UdevRulesInfo } from './udev-rules-info.js';
import { UhkDeviceProduct } from './uhk-products.js';

export interface DeviceConnectionState {
    connectedDevice?: UhkDeviceProduct;
    hasPermission: boolean;
    bootloaderActive: boolean;
    isMacroStatusDirty: boolean;
    /**
     * True if more then 1 UHK device connected.
     */
    multiDevice: boolean;
    communicationInterfaceAvailable: boolean;
    halvesInfo: HalvesInfo;
    hardwareModules?: HardwareModules;
    udevRulesInfo: UdevRulesInfo;
}
