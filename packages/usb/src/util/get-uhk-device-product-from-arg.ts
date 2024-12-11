import {
    UhkDeviceProduct,
} from 'uhk-common';

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
