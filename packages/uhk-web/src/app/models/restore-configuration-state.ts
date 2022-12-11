import { BackupUserConfiguration } from 'uhk-common';

export interface RestoreConfigurationState {
    restoringUserConfiguration: boolean;
    backupUserConfiguration: BackupUserConfiguration;
}
