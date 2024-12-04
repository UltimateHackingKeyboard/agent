import { Injectable } from '@angular/core';
import { UserConfiguration } from 'uhk-common';

@Injectable()
export class DefaultUserConfigurationService {
    private _defaultConfig60: UserConfiguration;
    private _defaultConfig80: UserConfiguration;

    getDefault60(): UserConfiguration {
        if (!this._defaultConfig60) {
            this._defaultConfig60 = new UserConfiguration()
                .fromJsonObject(require('./user-config.json'));
        }

        return this._defaultConfig60;
    }

    getDefault80(): UserConfiguration {
        if (!this._defaultConfig80) {
            this._defaultConfig80 = new UserConfiguration()
                .fromJsonObject(require('./user-config-80.json'));
        }

        return this._defaultConfig80;
    }
}
