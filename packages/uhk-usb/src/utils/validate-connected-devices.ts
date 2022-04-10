import { getNumberOfConnectedDevices } from './get-number-of-connected-devices.js';

export function validateConnectedDevices(): void {
    switch (getNumberOfConnectedDevices()) {
        case 0:
            throw new Error('Can not find connected device');

        case 1:
            return;

        default:
            throw new Error('Multiple devices aren\'t supported yet, so please connect only a single device to proceed further.');
    }
}
