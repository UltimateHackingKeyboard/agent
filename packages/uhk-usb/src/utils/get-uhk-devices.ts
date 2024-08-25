import { Device, devicesAsync } from 'node-hid';
import { UHK_VENDOR_ID } from 'uhk-common';

export async function getUhkDevices(vendorId: number = UHK_VENDOR_ID): Promise<Array<Device>> {
    return (await devicesAsync()).filter(x => x.vendorId === vendorId);
}
