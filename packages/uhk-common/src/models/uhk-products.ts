import { ModuleSlotToI2cAddress } from './module-slot-to-i2c-adress.js';
import { ModuleSlotToId } from './module-slot-id.js';
import { UHK_DEVICE_IDS, UHK_DEVICE_IDS_TYPE } from './uhk-device-ids.js';

export const UHK_VENDOR_ID = 0x1D50; // decimal 7504

export interface UhkDeviceProduct {
    id: UHK_DEVICE_IDS_TYPE;
    // TODO: Maybe it is not necessary
    name: string;
    // USB vendor ID
    vendorId: number;
    // USB product ID
    keyboardPid: number;
    // USB bootloader product ID
    bootloaderPid: number;
    buspalPid: number;
}

export const UNKNOWN_DEVICE: UhkDeviceProduct = {
    id: 0 as UHK_DEVICE_IDS_TYPE,
    vendorId: 0,
    bootloaderPid: 0,
    buspalPid: 0,
    keyboardPid: 0,
    name: 'Unknown'
};

export const UHK_60_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK60V1_RIGHT,
    name: 'UHK 60 v1',
    vendorId: UHK_VENDOR_ID,
    keyboardPid: 0x6122, // decimal 24866
    bootloaderPid: 0x6120, // decimal 24864
    buspalPid: 0x6121 // decimal 24865
};

export const UHK_60_V2_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK60V2_RIGHT,
    name: 'UHK 60 v2',
    vendorId: UHK_VENDOR_ID,
    keyboardPid: 0x6124, // decimal 24868
    bootloaderPid: 0x6123, // decimal 24867
    buspalPid: 0x6121 // decimal 24865
};

export const UHK_80_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK80_RIGHT,
    name: 'UHK 80',
    vendorId: UHK_VENDOR_ID,
    keyboardPid: 0x6125, // decimal 24869
    bootloaderPid: 0x6123, // decimal 24867
    buspalPid: 0x6121 // decimal 24865
};


export const UHK_DEVICES: Array<UhkDeviceProduct> = [
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE,
    UHK_80_DEVICE
];

export interface UhkModule {
    id: number;
    name: string;
    configPath?: string;
    slotId: ModuleSlotToId;
    i2cAddress: ModuleSlotToI2cAddress;
    firmwareUpgradeSupported: boolean;
}

export const LEFT_HALF_MODULE: UhkModule = {
    id: 1,
    name: 'Left keyboard half',
    slotId: ModuleSlotToId.leftHalf,
    i2cAddress: ModuleSlotToI2cAddress.leftHalf,
    firmwareUpgradeSupported: true
};

export const LEFT_KEY_CLUSTER_MODULE: UhkModule = {
    id: 2,
    name: 'Key cluster',
    configPath: '/add-on/key-cluster',
    slotId: ModuleSlotToId.leftModule,
    i2cAddress: ModuleSlotToI2cAddress.leftModule,
    firmwareUpgradeSupported: true,
};

export const RIGHT_TRACKBALL_MODULE: UhkModule = {
    id: 3,
    name: 'Trackball',
    configPath: '/add-on/trackball',
    slotId: ModuleSlotToId.rightModule,
    i2cAddress: ModuleSlotToI2cAddress.rightModule,
    firmwareUpgradeSupported: true,
};

export const RIGHT_TRACKPOINT_MODULE: UhkModule = {
    id: 4,
    name: 'Trackpoint',
    configPath: '/add-on/trackpoint',
    slotId: ModuleSlotToId.rightModule,
    i2cAddress: ModuleSlotToI2cAddress.rightModule,
    firmwareUpgradeSupported: true
};

export const RIGHT_TOUCHPAD_MODULE: UhkModule = {
    id: 5,
    name: 'Touchpad',
    configPath: '/add-on/touchpad',
    slotId: ModuleSlotToId.rightModule,
    i2cAddress: ModuleSlotToI2cAddress.rightTouchpad,
    firmwareUpgradeSupported: false
};

export const UHK_MODULES = [
    LEFT_HALF_MODULE,
    LEFT_KEY_CLUSTER_MODULE,
    RIGHT_TRACKBALL_MODULE,
    RIGHT_TRACKPOINT_MODULE,
    RIGHT_TOUCHPAD_MODULE
];
