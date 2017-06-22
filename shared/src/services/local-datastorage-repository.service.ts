import { Injectable } from '@angular/core';

import { UserConfiguration } from '../config-serializer/config-items/UserConfiguration';
import { DataStorageRepositoryService } from './datastorage-repository.service';
import { State as AutoUpdateSettings } from '../store/reducers/auto-update-settings';

@Injectable()
export class LocalDataStorageRepositoryService implements DataStorageRepositoryService {

    getConfig(): UserConfiguration {
        return JSON.parse(localStorage.getItem('config'));
    }

    saveConfig(config: UserConfiguration): void {
        localStorage.setItem('config', JSON.stringify(config.toJsonObject()));
    }

    getAutoUpdateSettings(): AutoUpdateSettings {
        return JSON.parse(localStorage.getItem('auto-update-settings'));
    }

    saveAutoUpdateSettings(settings: AutoUpdateSettings): void {
        localStorage.setItem('auto-update-settings', JSON.stringify(settings));
    }

}
