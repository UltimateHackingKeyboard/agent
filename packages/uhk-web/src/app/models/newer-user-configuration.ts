import { UserConfiguration } from 'uhk-common';

export interface NewerUserConfiguration {
    date?: string;
    type: 'reset' | 'backup'
    newUserConfigurationVersion: string;
    userConfiguration: UserConfiguration;
}
