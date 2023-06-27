import { BacklightingMode } from 'uhk-common';

export interface OutOfSpaceWarningData {
    backlightingMode: BacklightingMode;
    currentValue: number;
    maxValue: number;
    show: boolean;
}
