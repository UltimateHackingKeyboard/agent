import { devicesAsync } from 'node-hid';

import { isBootloader, isUhkCommunicationInterface } from '../util.js';

export async function getNumberOfConnectedDevices(): Promise<number> {
    return (await devicesAsync())
        .filter(dev => isUhkCommunicationInterface(dev) || isBootloader(dev))
        .length;
}
