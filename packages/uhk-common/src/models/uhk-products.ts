import { FIRMWARE_UPGRADE_METHODS, FIRMWARE_UPGRADE_METHODS_TYPE } from './firmware-upgrade-method.js';
import { ModuleSlotToI2cAddress } from './module-slot-to-i2c-adress.js';
import { ModuleSlotToId } from './module-slot-id.js';
import { UHK_DEVICE_IDS, UHK_DEVICE_IDS_TYPE } from './uhk-device-ids.js';
import { UHK_MODULE_IDS, UHK_MODULE_IDS_TYPE } from './uhk-module-ids.js';

export const UHK_VENDOR_ID_OLD = 0x1D50; // decimal 7504
export const UHK_VENDOR_ID = 0x37A8; // decimal 14248
export const UHK_BLE_MIN_PRODUCT_iD = 0x8000; // decimal 32768

export interface VidPidPair {
    vid: number;
    pid: number;
}

export interface UhkDeviceProduct {
    id: UHK_DEVICE_IDS_TYPE;
    // The reference of the device when provided as CLI argument
    asCliArg: string;
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS_TYPE,
    // Use it in logs instead of the name because UHK 80 left and right have the same name.
    // But we have to differentiate them in the logs
    logName: string;
    name: string;
    keyboard: VidPidPair[];
    bootloader: VidPidPair[];
    buspal: VidPidPair[];
    reportId: number;
}

export const UNKNOWN_DEVICE: UhkDeviceProduct = {
    id: 0 as UHK_DEVICE_IDS_TYPE,
    asCliArg: '',
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.KBOOT,
    logName: 'Unknown',
    name: 'Unknown',
    keyboard: [],
    bootloader: [],
    buspal: [],
    reportId: 0
};

export const UHK_60_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK60V1_RIGHT,
    asCliArg: 'uhk60v1',
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.KBOOT,
    logName: 'UHK 60 v1',
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
    asCliArg: 'uhk60v2',
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.KBOOT,
    logName: 'UHK 60 v2',
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

export const UHK_80_DEVICE_LEFT: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK80_LEFT,
    asCliArg: 'uhk80left',
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.MCUBOOT,
    logName: 'UHK 80 left',
    name: 'UHK 80',
    keyboard: [
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0007, // decimal 7
        },
    ],
    bootloader: [
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0006, // decimal 6
        },
    ],
    buspal: [],
    reportId: 4,
};

export const UHK_80_DEVICE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK80_RIGHT,
    asCliArg: 'uhk80',
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.MCUBOOT,
    logName: 'UHK 80 right',
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
    buspal: [],
    reportId: 4,
};

export const UHK_DONGLE: UhkDeviceProduct = {
    id: UHK_DEVICE_IDS.UHK_DONGLE,
    asCliArg: 'dongle',
    firmwareUpgradeMethod: FIRMWARE_UPGRADE_METHODS.MCUBOOT,
    logName: 'UHK Dongle',
    name: 'UHK Dongle',
    keyboard: [
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0005, // decimal 5
        },
    ],
    bootloader: [
        {
            vid: UHK_VENDOR_ID,
            pid: 0x0004, // decimal 4
        },
    ],
    buspal: [],
    reportId: 4,
};

export const UHK_DEVICES: Array<UhkDeviceProduct> = [
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE,
    UHK_80_DEVICE,
];

export const ALL_UHK_DEVICES = [
    ...UHK_DEVICES,
    UHK_80_DEVICE_LEFT,
    UHK_DONGLE,
];


export interface UhkModule {
    id: UHK_MODULE_IDS_TYPE;
    name: string;
    configPath?: string;
    slotId: ModuleSlotToId;
    i2cAddress: ModuleSlotToI2cAddress;
    firmwareUpgradeSupported: boolean;
}

export const LEFT_HALF_MODULE: UhkModule = {
    id: UHK_MODULE_IDS.LEFT_HALF,
    name: 'Left keyboard half',
    slotId: ModuleSlotToId.leftHalf,
    i2cAddress: ModuleSlotToI2cAddress.leftHalf,
    firmwareUpgradeSupported: true
};

export const LEFT_KEY_CLUSTER_MODULE: UhkModule = {
    id: UHK_MODULE_IDS.LEFT_KEY_CLUSTER,
    name: 'Key cluster',
    configPath: '/add-on/key-cluster',
    slotId: ModuleSlotToId.leftModule,
    i2cAddress: ModuleSlotToI2cAddress.leftModule,
    firmwareUpgradeSupported: true,
};

export const RIGHT_TRACKBALL_MODULE: UhkModule = {
    id: UHK_MODULE_IDS.RIGHT_TRACKBALL,
    name: 'Trackball',
    configPath: '/add-on/trackball',
    slotId: ModuleSlotToId.rightModule,
    i2cAddress: ModuleSlotToI2cAddress.rightModule,
    firmwareUpgradeSupported: true,
};

export const RIGHT_TRACKPOINT_MODULE: UhkModule = {
    id: UHK_MODULE_IDS.RIGHT_TRACKPOINT,
    name: 'Trackpoint',
    configPath: '/add-on/trackpoint',
    slotId: ModuleSlotToId.rightModule,
    i2cAddress: ModuleSlotToI2cAddress.rightModule,
    firmwareUpgradeSupported: true
};

export const RIGHT_TOUCHPAD_MODULE: UhkModule = {
    id: UHK_MODULE_IDS.RIGHT_TOUCHPAD,
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
