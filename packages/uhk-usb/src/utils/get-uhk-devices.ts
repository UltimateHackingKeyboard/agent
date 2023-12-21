import { Device, devices } from 'node-hid';
import { UHK_VENDOR_ID } from 'uhk-common';

export function getUhkDevices(vendorId: number = UHK_VENDOR_ID): Array<Device> {
    return devices().filter(x => x.vendorId === vendorId);
}
