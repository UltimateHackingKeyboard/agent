import { Device, devicesAsync } from 'node-hid';
import {
    ALL_UHK_DEVICES,
    UhkDeviceProduct,
} from 'uhk-common';
import { isUhkCommunicationUsage } from 'uhk-usb/dist/src/index.js';

export function getUhkDeviceProductFromArg(uhkDevices: UhkDeviceProduct[], deviceArg: string): UhkDeviceProduct {
    const uhkDeviceProduct = uhkDevices.find(uhkDevice => uhkDevice.asCliArg === deviceArg);

    if (uhkDeviceProduct) {
        return uhkDeviceProduct;
    }

    const devicesOptions = getDevicesOptions(uhkDevices);
    console.error(`Invalid device argument: ${deviceArg}. Available options: {${devicesOptions}}`);
    process.exit(1);
}

export function getDevicesOptions(uhkDevices: UhkDeviceProduct[]): string {
    return uhkDevices.map(uhkDevice => uhkDevice.asCliArg).join('|');
}

export async  function getHidDevicesFromDeviceArg(deviceArg: string): Promise<Device[]> {
    if (!deviceArg) {
        return [];
    }

    const result: Device[] = [];

    const hidDevices = await devicesAsync();

    const deviceClas = deviceArg.split(',');
    for (const deviceCla of deviceClas) {
        const uhkDeviceProduct = getUhkDeviceProductFromArg(ALL_UHK_DEVICES, deviceCla);

        const devices = hidDevices.filter(hidDevice => uhkDeviceProduct.keyboard.some(vidPid => {
            return vidPid.vid === hidDevice.vendorId
            && vidPid.pid == hidDevice.productId
            && isUhkCommunicationUsage(hidDevice);
        }));

        if (devices.length === 0) {
            console.error(`Can not find connected device: ${deviceArg}.`);
            process.exit(1);
        }

        if (devices.length > 1) {
            console.error(`Multiple  ${deviceArg} device connected.`);
            process.exit(1);
        }

        result.push(devices[0]);
    }

    return result;
}
