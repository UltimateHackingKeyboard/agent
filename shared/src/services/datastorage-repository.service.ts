import { InjectionToken } from '@angular/core';

import { UserConfiguration } from '../config-serializer/config-items/UserConfiguration';

export interface DataStorageRepositoryService {

    getConfig(): UserConfiguration;

    saveConfig(config: UserConfiguration): void;
}

export let DATA_STORAGE_REPOSITORY = new InjectionToken('dataStorage-repository');
