import { HalvesInfo } from './halves-info.js';
import { HardwareModules } from './hardware-modules.js';
import { UhkDeviceProduct } from './uhk-products.js';

export interface DeviceConnectionState {
    connectedDevice?: UhkDeviceProduct;
    hasPermission: boolean;
    bootloaderActive: boolean;
    /**
     * True if more then 1 UHK device connected.
     */
    multiDevice: boolean;
    zeroInterfaceAvailable: boolean;
    halvesInfo: HalvesInfo;
    hardwareModules?: HardwareModules;
}
