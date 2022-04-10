import { HardwareModules } from './hardware-modules.js';
import { UserConfiguration } from '../config-serializer/config-items/user-configuration.js';

export interface ConfigurationReply {
    success: boolean;
    userConfiguration?: string;
    hardwareConfiguration?: string;
    modules?: HardwareModules;
    error?: string;
    backupConfiguration?: UserConfiguration;
}
