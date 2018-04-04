import { HardwareModules } from './hardware-modules';
import { UserConfiguration } from '../config-serializer/config-items';

export interface ConfigurationReply {
    success: boolean;
    userConfiguration?: string;
    hardwareConfiguration?: string;
    modules?: HardwareModules;
    error?: string;
    backupConfiguration?: UserConfiguration;
}
