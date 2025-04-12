import { Device, devicesAsync } from 'node-hid';
import { UHK_VENDOR_ID, UHK_VENDOR_ID_OLD } from 'uhk-common';

export async function getUhkHidDevices(vendorIds: number[] = [UHK_VENDOR_ID, UHK_VENDOR_ID_OLD]): Promise<Array<Device>> {
    return (await devicesAsync()).filter(x => vendorIds.includes(x.vendorId));
}
