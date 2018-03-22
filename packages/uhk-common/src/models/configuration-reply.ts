import { HardwareModules } from './hardware-modules';

export interface ConfigurationReply {
    success: boolean;
    userConfiguration?: string;
    hardwareConfiguration?: string;
    modules?: HardwareModules;
    error?: string;
}
