import { UhkDeviceProduct } from 'uhk-common';

import { EnumerationModes } from '../constants.js';

export interface ReenumerateOption {
    enumerationMode: EnumerationModes;
    device: UhkDeviceProduct;
    timeout?: number;
}
