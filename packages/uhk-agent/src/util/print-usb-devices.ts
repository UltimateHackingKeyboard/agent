import {devices} from 'node-hid';

export async function printUsbDevices(): Promise<void> {
    console.log(devices());
}
