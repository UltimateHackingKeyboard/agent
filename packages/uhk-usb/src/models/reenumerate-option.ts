import { EnumerationModes } from '../constants';

export interface ReenumerateOption {
    enumerationMode: EnumerationModes;
    // The USB product id that should appear after the re-enumeration
    pid: number;
    // The USB vendor id that should appear after the re-enumeration
    vid: number;
    timeout?: number;
}
