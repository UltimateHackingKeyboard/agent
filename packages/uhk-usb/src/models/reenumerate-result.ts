import { VidPidPair } from 'uhk-common';

export interface ReenumerateResult {
    vidPidPair: VidPidPair
    usbPath: string;
    serialPath: string;
}
