import { UhkDeviceProduct } from 'uhk-common';

import { snooze } from '../util.js';
import { isUhkDeviceConnected } from './is-uhk-device-connected.js';

export async function waitForUhkDeviceConnected(device: UhkDeviceProduct): Promise<void> {
    while (true) {
        if (await isUhkDeviceConnected(device)) {
            break;
        }

        await snooze(250);
    }
}
