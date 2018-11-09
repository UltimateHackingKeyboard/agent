import { UdevRulesInfo } from './udev-rules-info';

export interface DeviceConnectionState {
    connected: boolean;
    hasPermission: boolean;
    bootloaderActive: boolean;
    zeroInterfaceAvailable: boolean;
    udevRulesInfo: UdevRulesInfo;
}
