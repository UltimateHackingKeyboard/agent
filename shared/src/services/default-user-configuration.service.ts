import { Injectable } from '@angular/core';
import { UserConfiguration } from '../config-serializer/config-items/user-configuration';

@Injectable()
export class DefaultUserConfigurationService {
    private _defaultConfig: UserConfiguration;

    constructor() {
        this._defaultConfig = new UserConfiguration()
            .fromJsonObject(require('json-loader!../config-serializer/user-config.json'));
    }

    getDefault(): UserConfiguration {
        return this._defaultConfig;
    }
}
