import { Injectable } from '@angular/core';
import { UserConfiguration } from '../config-serializer/config-items/UserConfiguration';
import { IDataStorageRepositoryService } from './datastorage-repository.service';
import {DefaultUserConfigurationService} from './default-user-configuration.service';

@Injectable()
export class LocalDataStorageRepositoryService implements IDataStorageRepositoryService {
    constructor(private defaultUserConfigurationService: DefaultUserConfigurationService) { }

    getConfig(): UserConfiguration {
        const configJsonString = localStorage.getItem('config');
        let config: UserConfiguration;

        if (configJsonString) {
            const configJsonObject = JSON.parse(configJsonString);
            if (configJsonObject.dataModelVersion === this.defaultUserConfigurationService.getDefault().dataModelVersion) {
                config = new UserConfiguration().fromJsonObject(configJsonObject);
            }
        }

        return config;
    }

    saveConfig(config: UserConfiguration): void {
        localStorage.setItem('config', JSON.stringify(config.toJsonObject()));
    }
}
