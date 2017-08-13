import { Injectable } from '@angular/core';

import { UserConfiguration } from '../config-serializer/config-items/user-configuration';
import { AutoUpdateSettings } from '../models/auto-update-settings';

@Injectable()
export class DataStorageRepositoryService {

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
