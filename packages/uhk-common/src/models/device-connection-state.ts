import { UdevRulesInfo } from './udev-rules-info';
import { HalvesInfo } from './halves-info';

export interface DeviceConnectionState {
    connected: boolean;
    hasPermission: boolean;
    bootloaderActive: boolean;
    zeroInterfaceAvailable: boolean;
    udevRulesInfo: UdevRulesInfo;
    halvesInfo: HalvesInfo;
}
