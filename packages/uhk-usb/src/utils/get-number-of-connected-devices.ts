import { devices } from 'node-hid';

import { isBootloader, isUhkZeroInterface } from '../util';

export function getNumberOfConnectedDevices(): number {
    return devices()
        .filter(dev => isUhkZeroInterface(dev) || isBootloader(dev))
        .length;
}
