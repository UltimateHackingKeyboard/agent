import { ipcRenderer } from 'electron';

import { ApplicationSettings, IpcEvents, UserConfiguration } from 'uhk-common';
import { Observable, from, of } from 'rxjs';

import { DataStorageRepositoryService } from '../../app/services/datastorage-repository.service';

export class ElectronDataStorageRepositoryService implements DataStorageRepositoryService {
    static async getValue(key: string): Promise<any> {
        const value = await ipcRenderer.invoke(IpcEvents.app.getConfig, key);
        if (!value) {
            return null;
        }

        return JSON.parse(<string>value);
    }

    static async saveValue(key: string, value: any): Promise<null> {
        await ipcRenderer.invoke(IpcEvents.app.setConfig, key, JSON.stringify(value));

        return null;
    }

    // TODO: Throw error when read user config from electron datastore
    // Agent-electron should always read the configuration from the UHK over USB which will be implemented later.
    // If implemented the feature should have to throw an error to prevent unwanted side effects.
    getConfig(): Observable<UserConfiguration> {
        return of(null);
    }

    // TODO: Throw error when save user config from electron-datastore
    // Agent-electron should always read the configuration from the UHK over USB which will be implemented later.
    // If implemented the feature should have to throw an error to prevent unwanted side effects.
    saveConfig(config: UserConfiguration): Observable<null> {
        return of(null);
    }

    getApplicationSettings(): Observable<ApplicationSettings> {
        return from(ElectronDataStorageRepositoryService.getValue('application-settings'));
    }

    saveApplicationSettings(settings: ApplicationSettings): Observable<null> {
        return from(ElectronDataStorageRepositoryService.saveValue('application-settings', settings));
    }
}
