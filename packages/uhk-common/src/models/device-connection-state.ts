import { HalvesInfo } from './halves-info';
import { UhkDeviceProduct } from './uhk-products';

export interface DeviceConnectionState {
    connectedDevice?: UhkDeviceProduct;
    hasPermission: boolean;
    bootloaderActive: boolean;
    zeroInterfaceAvailable: boolean;
    halvesInfo: HalvesInfo;
}
