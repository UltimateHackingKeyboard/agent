import { UhkDeviceProduct } from 'uhk-common';

import { isUhkDeviceConnected } from './is-uhk-device-connected.js';
import { snooze } from './snooze.js';

export async function waitForUhkDeviceConnected(device: UhkDeviceProduct): Promise<void> {
    while (true) {
        if (await isUhkDeviceConnected(device)) {
            break;
        }

        await snooze(250);
    }
}
