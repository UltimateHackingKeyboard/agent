import { HardwareModules } from 'uhk-common';

export interface UpdateFirmwareSuccessPayload {
    firmwareDowngraded: boolean;
    hardwareModules: HardwareModules;
    userConfigSaved: boolean;
}
