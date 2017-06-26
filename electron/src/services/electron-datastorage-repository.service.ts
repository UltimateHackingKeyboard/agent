import * as storage from 'electron-settings';

import { UserConfiguration } from '../shared/config-serializer/config-items/user-configuration';
import { DataStorageRepositoryService } from '../shared/services/datastorage-repository.service';
import { AutoUpdateSettings } from '../shared/models/auto-update-settings';

export class ElectronDataStorageRepositoryService implements DataStorageRepositoryService {
    static getValue(key: string): any {
        const value = storage.get(key);
        if (!value) {
            return null;
        }

        return JSON.parse(<string>value);
    }

    static saveValue(key: string, value: any) {
        storage.set(key, JSON.stringify(value));
    }

    getConfig(): UserConfiguration {
        return ElectronDataStorageRepositoryService.getValue('user-config');
    }

    saveConfig(config: UserConfiguration): void {
        ElectronDataStorageRepositoryService.saveValue('user-config', config.toJsonObject());
    }

    getAutoUpdateSettings(): AutoUpdateSettings {
        return ElectronDataStorageRepositoryService.getValue('auto-update-settings');
    }

    saveAutoUpdateSettings(settings: AutoUpdateSettings): void {
        ElectronDataStorageRepositoryService.saveValue('auto-update-settings', settings);
    }
}
