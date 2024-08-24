import {devicesAsync} from 'node-hid';

export async function printUsbDevices(): Promise<void> {
    console.log(await devicesAsync());
}
