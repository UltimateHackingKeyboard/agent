import { HalvesInfo } from './halves-info';

export interface DeviceConnectionState {
    connected: boolean;
    hasPermission: boolean;
    bootloaderActive: boolean;
    zeroInterfaceAvailable: boolean;
    halvesInfo: HalvesInfo;
}
