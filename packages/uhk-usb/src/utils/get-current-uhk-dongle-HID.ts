import { devicesAsync, Device } from 'node-hid';

import { isDongleCommunicationDevice } from './is-dongle-communication-device.js';

export const MULTIPLE_DONGLE_CONNECTED_ERROR_MESSAGE = 'Multiple dongle aren\'t supported yet, so please connect only a single dongle to proceed further.';

export async function getCurrentUhkDongleHID(): Promise<Device | undefined> {
    const hidDevices = await devicesAsync();

    const devices = hidDevices.filter(device => isDongleCommunicationDevice(device));

    if (devices.length === 0) {
        return;
    }

    if (devices.length === 1)
        return devices[0];

    throw new Error(MULTIPLE_DONGLE_CONNECTED_ERROR_MESSAGE);
}
