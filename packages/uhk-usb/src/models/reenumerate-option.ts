import { UhkDeviceProduct } from 'uhk-common';

import { EnumerationModes } from '../constants.js';

export interface ReenumerateOption {
    enumerationMode: EnumerationModes;
    /**
     * Send reenumeration command even the device in the desired state
     */
    force?: boolean;
    device: UhkDeviceProduct;
    timeout?: number;
}
