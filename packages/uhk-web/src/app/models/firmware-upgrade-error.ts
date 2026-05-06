import { HardwareModules } from 'uhk-common';

export interface FirmwareUpgradeError {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    modules?: HardwareModules;
}
