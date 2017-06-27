import { InjectionToken } from '@angular/core';

import { UserConfiguration } from '../config-serializer/config-items/user-configuration';
import { AutoUpdateSettings } from '../models/auto-update-settings';

export interface DataStorageRepositoryService {

    getConfig(): UserConfiguration;

    saveConfig(config: UserConfiguration): void;

    getAutoUpdateSettings(): AutoUpdateSettings;

    saveAutoUpdateSettings(settings: AutoUpdateSettings): void;
}

export let DATA_STORAGE_REPOSITORY = new InjectionToken('dataStorage-repository');
