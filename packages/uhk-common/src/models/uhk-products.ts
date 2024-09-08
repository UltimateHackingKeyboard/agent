import { FIRMWARE_UPGRADE_METHODS, FIRMWARE_UPGRADE_METHODS_TYPE } from './firmware-upgrade-method.js';
import { ModuleSlotToI2cAddress } from './module-slot-to-i2c-adress.js';
import { ModuleSlotToId } from './module-slot-id.js';
import { UHK_DEVICE_IDS, UHK_DEVICE_IDS_TYPE } from './uhk-device-ids.js';

export const UHK_VENDOR_ID_OLD = 0x1D50; // decimal 7504
export const UHK_VENDOR_ID = 0x37A8; // decimal 14248

export interface VidPidPair {
    vid: number;
    pid: number;
}

export interface UhkDeviceProduct {
    id: UHK_DEVICE_IDS_TYPE;
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS_TYPE,
    name: string;
    keyboard: VidPidPair[];
    bootloader: VidPidPair[];
    buspal: VidPidPair[];
    reportId: number;
}

export const UNKNOWN_DEVICE: UhkDeviceProduct = {
    id: 0 as UHK_DEVICE_IDS_TYPE,
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.KBOOT,
    name: 'Unknown',
    keyboard: [],
    bootloader: [],
    buspal: [],
    reportId: 0
};

export const UHK_60_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK60V1_RIGHT,
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.KBOOT,
    name: 'UHK 60 v1',
    keyboard: [
        {
            vid: UHK_VENDOR_ID_OLD,
            pid: 0x6122, // decimal 24866
        },
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0001 // decimal 1
        },
    ],
    bootloader: [
        {
            vid: UHK_VENDOR_ID_OLD,
            pid: 0x6120, // decimal 24864
        },
    ],
    buspal: [
        {
            vid: UHK_VENDOR_ID_OLD,
            pid: 0x6121 // decimal 24865
        },
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0000 // decimal 0
        },
    ],
    reportId: 0,
};

export const UHK_60_V2_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK60V2_RIGHT,
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.KBOOT,
    name: 'UHK 60 v2',
    keyboard: [
        {
            vid: UHK_VENDOR_ID_OLD,
            pid: 0x6124, // decimal 24868
        },
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0003 // decimal 3
        },
    ],
    bootloader: [
        {
            vid: UHK_VENDOR_ID_OLD,
            pid: 0x6123, // decimal 24867
        },
    ],
    buspal: [
        {
            vid: UHK_VENDOR_ID_OLD,
            pid: 0x6121 // decimal 24865
        },
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0002 // decimal 2
        },
    ],
    reportId: 0,
};

export const UHK_80_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK80_RIGHT,
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.MCUBOOT,
    name: 'UHK 80',
    keyboard: [
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0009, // decimal 9
        },
    ],
    bootloader: [
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0008, // decimal 8
        },
    ],
    // TODO: Implement when we know
    buspal: [],
    reportId: 4,
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
