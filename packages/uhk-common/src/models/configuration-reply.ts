import { BackupUserConfiguration } from './backup-user-configuration.js';
import { HardwareModules } from './hardware-modules.js';

export interface ConfigurationReply {
    success: boolean;
    userConfiguration?: string;
    hardwareConfiguration?: string;
    modules?: HardwareModules;
    error?: string;
    backupConfiguration?: BackupUserConfiguration;
}
