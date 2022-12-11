import { UserConfiguration } from '../config-serializer/index.js';
import { BackupUserConfigurationInfo } from './backup-user-configuration-info.js';

export interface BackupUserConfiguration {
    /**
     * When saved the latest user configuration
     */
    date?: string;
    info: BackupUserConfigurationInfo;
    userConfiguration?: UserConfiguration;
}
