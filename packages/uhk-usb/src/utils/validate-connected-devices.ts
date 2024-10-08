import { getNumberOfConnectedDevices } from './get-number-of-connected-devices.js';

export async function validateConnectedDevices(): Promise<void> {
    const devices = await getNumberOfConnectedDevices();

    switch (devices) {
        case 0:
            throw new Error('Can not find connected device');

        case 1:
            return;

        default:
            throw new Error('Multiple devices aren\'t supported yet, so please connect only a single device to proceed further.');
    }
}
