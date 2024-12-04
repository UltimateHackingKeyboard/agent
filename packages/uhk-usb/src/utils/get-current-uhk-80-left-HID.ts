import { devicesAsync, Device } from 'node-hid';

import { isLeftHalfCommunicationDevice } from './is-left-half-communication-device.js';

export const MULTIPLE_UHK80_LEFT_CONNECTED_ERROR_MESSAGE = 'Multiple UHK80 Left half aren\'t supported yet, so please connect only a single left half to proceed further.';

export async function getCurrenUhk80LeftHID(): Promise<Device | undefined> {
    const hidDevices = await devicesAsync();

    const devices = hidDevices.filter(device => isLeftHalfCommunicationDevice(device));

    if (devices.length === 0) {
        return;
    }

    if (devices.length === 1)
        return devices[0];

    throw new Error(MULTIPLE_UHK80_LEFT_CONNECTED_ERROR_MESSAGE);
}
