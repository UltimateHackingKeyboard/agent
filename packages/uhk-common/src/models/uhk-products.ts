import { ModuleSlotToI2cAddress } from './module-slot-to-i2c-adress';
import { ModuleSlotToId } from './module-slot-id';

export enum UhkProductTypes {
    Device = 'Device',
    Module = 'Module'
}

export interface UhkProduct {
    type: UhkProductTypes;
    id: number;
    // TODO: Maybe it is not necessary
    name: string;
    // USB vendor ID
    vendorId: number;
    // USB product ID
    keyboardPid: number;
    // USB bootloader product ID
    bootloaderPid: number;
}

export interface UhkDeviceProduct extends UhkProduct {
    type: UhkProductTypes.Device;
    buspalPid: number;
}

export const UHK_60_DEVICE: UhkDeviceProduct = {
    type: UhkProductTypes.Device,
    id: 1,
    name: 'UHK 60 v1',
    vendorId: 0x1D50,
    keyboardPid: 0x6122,
    bootloaderPid: 0x6120,
    buspalPid: 0x6121
};

export const UHK_60_V2_DEVICE: UhkDeviceProduct = {
    type: UhkProductTypes.Device,
    id: 2,
    name: 'UHK 60 v2',
    vendorId: 0x1D50,
    keyboardPid: 0x6124,
    bootloaderPid: 0x6123,
    buspalPid: 0x6121
};

export const UHK_DEVICES: Array<UhkDeviceProduct> = [
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE
];

export interface UhkModule {
    type: UhkProductTypes.Module;
    id: number;
    name: string;
    slotId: ModuleSlotToId;
    slotName: string;
    i2cAddress: ModuleSlotToI2cAddress;
    firmwareUpgradeSupported: boolean;
    bootloaderPingReconnectMsg: string;
}

export const LEFT_HALF_MODULE: UhkModule = {
    type: UhkProductTypes.Module,
    id: 1,
    name: 'Left Keyboard Half',
    slotId: ModuleSlotToId.leftHalf,
    slotName: 'LeftKeyboardHalf',
    i2cAddress: ModuleSlotToI2cAddress.leftHalf,
    firmwareUpgradeSupported: true,
    bootloaderPingReconnectMsg: 'Cannot ping the bootloader. Please remove the bridge cable, and keep reconnecting the left keyboard half until you see this message.'
};

export const LEFT_KEY_CLUSTER_MODULE: UhkModule = {
    type: UhkProductTypes.Module,
    id: 2,
    name: 'Left Key Cluster',
    slotId: ModuleSlotToId.leftModule,
    slotName: 'KeyClusterLeft',
    i2cAddress: ModuleSlotToI2cAddress.leftModule,
    firmwareUpgradeSupported: true,
    bootloaderPingReconnectMsg: 'Cannot ping the bootloader. Please remove the "Left Key Cluster" module, and keep reconnecting it until you see this message.'
};

export const RIGHT_TRACKBALL_MODULE: UhkModule = {
    type: UhkProductTypes.Module,
    id: 3,
    name: 'Right Trackball',
    slotId: ModuleSlotToId.rightModule,
    slotName: 'TrackballRight',
    i2cAddress: ModuleSlotToI2cAddress.rightModule,
    firmwareUpgradeSupported: true,
    bootloaderPingReconnectMsg: 'Cannot ping the bootloader. Please remove the "Right trackball" module, and keep reconnecting it until you see this message.'
};

export const RIGHT_TRACKPOINT_MODULE: UhkModule = {
    type: UhkProductTypes.Module,
    id: 4,
    name: 'Right Trackpoint',
    slotId: ModuleSlotToId.rightModule,
    slotName: 'TrackpointRight',
    i2cAddress: ModuleSlotToI2cAddress.rightModule,
    firmwareUpgradeSupported: true,
    bootloaderPingReconnectMsg: 'Cannot ping the bootloader. Please remove the "Right Trackpoint" module, and keep reconnecting it until you see this message.'
};

export const RIGHT_TOUCHPAD_MODULE: UhkModule = {
    type: UhkProductTypes.Module,
    id: 5,
    name: 'Right Touchpad',
    slotId: ModuleSlotToId.rightModule,
    slotName: 'TrackpointRight',
    i2cAddress: ModuleSlotToI2cAddress.rightModule,
    firmwareUpgradeSupported: false,
    bootloaderPingReconnectMsg: 'Cannot ping the bootloader. Please remove the "Right Touchpad" module, and keep reconnecting it until you see this message.'
};

export const UHK_MODULES = [
    LEFT_HALF_MODULE,
    LEFT_KEY_CLUSTER_MODULE,
    RIGHT_TRACKBALL_MODULE,
    RIGHT_TRACKPOINT_MODULE,
    RIGHT_TOUCHPAD_MODULE
];
