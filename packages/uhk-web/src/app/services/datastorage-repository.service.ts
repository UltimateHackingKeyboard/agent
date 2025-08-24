import { Injectable } from '@angular/core';
import {
    ApplicationSettings,
    UHK_DEVICE_IDS,
    UhkDeviceProduct,
    UserConfiguration,
} from 'uhk-common';
import { Observable, of } from 'rxjs';

@Injectable()
export class DataStorageRepositoryService {

    getConfig(uhkDeviceProduct: UhkDeviceProduct): Observable<UserConfiguration> {
        return of(JSON.parse(localStorage.getItem(this.userConfigKeyFromDevice(uhkDeviceProduct))));
    }

    saveConfig(config: UserConfiguration, uhkDeviceProduct: UhkDeviceProduct): Observable<null> {
        localStorage.setItem(this.userConfigKeyFromDevice(uhkDeviceProduct), JSON.stringify(config.toJsonObject()));

        return of(null);
    }

    getApplicationSettings(): Observable<ApplicationSettings> {
        return of(JSON.parse(localStorage.getItem('application-settings')));
    }

    saveApplicationSettings(settings: ApplicationSettings): Observable<null> {
        localStorage.setItem('application-settings', JSON.stringify(settings));

        return of(null);
    }

    protected userConfigKeyFromDevice(uhkDeviceProduct: UhkDeviceProduct): string {
        return uhkDeviceProduct.id === UHK_DEVICE_IDS.UHK80_RIGHT
            ? 'config-uhk-80'
            : 'config'
    }
}
