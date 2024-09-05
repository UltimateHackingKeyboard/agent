import { VidPidPair } from 'uhk-common';

import { EnumerationModes } from '../constants.js';

export interface ReenumerateOption {
    enumerationMode: EnumerationModes;
    // The USB vendorId and product id that should appear after the re-enumeration
    vidPidPairs: VidPidPair[];
    timeout?: number;
}
