import { devicesAsync, Device } from 'node-hid';

import { isRightHalfCommunicationDevice } from './is-right-half-communication-device.js';

export const MULTIPLE_UHK80_RIGHT_CONNECTED_ERROR_MESSAGE = 'Multiple UHK80 Right half aren\'t supported yet, so please connect only a single right half to proceed further.';

export async function getCurrenUhk80RightHID(): Promise<Device | undefined> {
    const hidDevices = await devicesAsync();

    const devices = hidDevices.filter(device => isRightHalfCommunicationDevice(device));

    if (devices.length === 0) {
        return;
    }

    if (devices.length === 1)
        return devices[0];

    throw new Error(MULTIPLE_UHK80_RIGHT_CONNECTED_ERROR_MESSAGE);
}
