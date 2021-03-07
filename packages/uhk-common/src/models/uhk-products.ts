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
