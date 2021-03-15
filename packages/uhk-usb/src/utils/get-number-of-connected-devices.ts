import { devices } from 'node-hid';

import { isBootloader, isUhkMgmtInterface } from '../util';

export function getNumberOfConnectedDevices(): number {
    // TODO: pass vendor id ????
    return devices()
        .filter(dev => isUhkMgmtInterface(dev) || isBootloader(dev))
        .length;
}
