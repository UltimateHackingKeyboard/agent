import { Injectable } from '@angular/core';
import { ApplicationSettings, UserConfiguration } from 'uhk-common';

@Injectable()
export class DataStorageRepositoryService {

    getConfig(): UserConfiguration {
        return JSON.parse(localStorage.getItem('config'));
    }

    saveConfig(config: UserConfiguration): void {
        localStorage.setItem('config', JSON.stringify(config.toJsonObject()));
    }

    getApplicationSettings(): ApplicationSettings {
        return JSON.parse(localStorage.getItem('application-settings'));
    }

    saveApplicationSettings(settings: ApplicationSettings): void {
        localStorage.setItem('application-settings', JSON.stringify(settings));
    }
}
