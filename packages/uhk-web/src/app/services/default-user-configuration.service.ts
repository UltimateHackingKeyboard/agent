import { Injectable } from '@angular/core';
import { UhkDeviceProduct, UserConfiguration, UHK_80_DEVICE } from 'uhk-common';

@Injectable()
export class DefaultUserConfigurationService {
    private _defaultConfig60: UserConfiguration;
    private _defaultConfig80: UserConfiguration;

    getDefault60(): UserConfiguration {
        if (!this._defaultConfig60) {
            this._defaultConfig60 = new UserConfiguration()
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                .fromJsonObject(require('./user-config.json'));
        }

        return this._defaultConfig60;
    }

    getDefault80(): UserConfiguration {
        if (!this._defaultConfig80) {
            this._defaultConfig80 = new UserConfiguration()
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                .fromJsonObject(require('./user-config-80.json'));
        }

        return this._defaultConfig80;
    }

    getResetUserConfiguration(uhkDeviceProduct: UhkDeviceProduct): UserConfiguration {
        let config: UserConfiguration;

        if (uhkDeviceProduct?.id === UHK_80_DEVICE.id) {
            config = this.getDefault80().clone();
        }
        else {
            config = this.getDefault60().clone();
        }

        config.keymaps = config.keymaps.filter(keymap => keymap.abbreviation !== 'EMP');

        return config;
    }
}
