import { devices } from 'node-hid';

import { isBootloader, isUhkCommunicationInterface } from '../util.js';

export function getNumberOfConnectedDevices(): number {
    return devices()
        .filter(dev => isUhkCommunicationInterface(dev) || isBootloader(dev))
        .length;
}
