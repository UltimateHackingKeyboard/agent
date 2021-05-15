import { Device, devices } from 'node-hid';
import { UHK_VENDOR_ID } from 'uhk-common';

export function getUhkDevices(): Array<Device> {
    return devices().filter(x => x.vendorId === UHK_VENDOR_ID);
}
