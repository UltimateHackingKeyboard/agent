import { UserConfiguration } from 'uhk-common';

export interface ApplyUserConfigurationFromFilePayload {
    userConfig: UserConfiguration;
    saveInHistory: boolean;
}
