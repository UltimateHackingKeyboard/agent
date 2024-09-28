import { DeviceIdentifier } from 'uhk-common';
import { getNumberOfConnectedDevices } from './get-number-of-connected-devices.js';

export const MULTIPLE_DEVICE_CONNECTED_ERROR_MESSAGE = 'Multiple devices aren\'t supported yet, so please connect only a single device to proceed further.';
export const CANT_FIND_CONNECTED_DEVICE_ERROR_MESSAGE = 'Can not find connected device';

export async function validateConnectedDevices(deviceIdentifier?: DeviceIdentifier): Promise<void> {
    const devices = await getNumberOfConnectedDevices(deviceIdentifier);

    switch (devices) {
        case 0:
            throw new Error(CANT_FIND_CONNECTED_DEVICE_ERROR_MESSAGE);

        case 1:
            return;

        default:
            throw new Error(MULTIPLE_DEVICE_CONNECTED_ERROR_MESSAGE);
    }
}
