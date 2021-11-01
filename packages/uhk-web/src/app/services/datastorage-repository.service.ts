import { Injectable } from '@angular/core';
import { ApplicationSettings, UserConfiguration } from 'uhk-common';
import { Observable, of } from 'rxjs';

@Injectable()
export class DataStorageRepositoryService {

    getConfig(): Observable<UserConfiguration> {
        return of(JSON.parse(localStorage.getItem('config')));
    }

    saveConfig(config: UserConfiguration): Observable<null> {
        localStorage.setItem('config', JSON.stringify(config.toJsonObject()));

        return of(null);
    }

    getApplicationSettings(): Observable<ApplicationSettings> {
        return of(JSON.parse(localStorage.getItem('application-settings')));
    }

    saveApplicationSettings(settings: ApplicationSettings): Observable<null> {
        localStorage.setItem('application-settings', JSON.stringify(settings));

        return of(null);
    }
}
