import { devices } from 'node-hid';
import { DeviceIdentifier } from 'uhk-common';

import { isBootloader, isUhkCommunicationInterface } from '../util.js';
import { deviceVidPidInterfaceFilter } from './device-vid-pid-interface-filter.js';

export function getNumberOfConnectedDevices(deviceIdentifier: DeviceIdentifier = {}): number {
    const isVidPidInterfaceMatching = deviceVidPidInterfaceFilter(deviceIdentifier);

    return devices()
        .filter(dev => {
            if (deviceIdentifier['serial-number']) {
                return deviceIdentifier['serial-number'] === dev.serialNumber
                    && (deviceIdentifier.vid && isVidPidInterfaceMatching(dev)
                        || (!deviceIdentifier.vid && isUhkCommunicationInterface(dev))
                    );
            }

            if (deviceIdentifier.vid) {
                return isVidPidInterfaceMatching(dev);
            }

            return isUhkCommunicationInterface(dev) || isBootloader(dev);
        })
        .length;
}
