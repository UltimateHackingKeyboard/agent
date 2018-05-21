import { HardwareModules } from 'uhk-common';

export interface FirmwareUpgradeError {
    error: any;
    modules?: HardwareModules;
}
