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
    vid: number;
    // USB product ID
    pid: number;
    // USB bootloader product ID
    bootloaderId: number;
}

export interface UhkDeviceProduct extends UhkProduct {
    type: UhkProductTypes.Device;
    buspal: number;
    normalKeyboard: number;
}

export const UHK_60_DEVICE: UhkDeviceProduct = {
    type: UhkProductTypes.Device,
    id: 1,
    name: 'uhk60-right',
    vid: 0x1D50,
    pid: 0x6122,
    bootloaderId: 0x6120,
    buspal: 0x6121,
    normalKeyboard: 0x6122
};

export const UHK_60_V2_DEVICE: UhkDeviceProduct = {
    type: UhkProductTypes.Device,
    id: 2,
    name: 'uhk60-v2-right',
    vid: 0x1D50,
    pid: 0x6124,
    bootloaderId: 0x6123,
    buspal: 0x6121,
    normalKeyboard: 0x6124
};

export const UHK_DEVICES: Array<UhkDeviceProduct> = [
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE
];
