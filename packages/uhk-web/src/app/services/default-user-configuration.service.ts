import { Injectable } from '@angular/core';
import { UserConfiguration } from 'uhk-common';

@Injectable()
export class DefaultUserConfigurationService {
    private _defaultConfig: UserConfiguration;

    constructor() {
        this._defaultConfig = new UserConfiguration().fromJsonObject(require('./user-config.json'));
    }

    getDefault(): UserConfiguration {
        return this._defaultConfig;
    }
}
