import { Injectable } from '@angular/core';
import { UhkDeviceProduct, UserConfiguration, UHK_80_DEVICE, UHK_60_USER_CONFIG, UHK_80_USER_CONFIG } from 'uhk-common';

@Injectable()
export class DefaultUserConfigurationService {
    private _defaultConfig60: UserConfiguration;
    private _defaultConfig80: UserConfiguration;

    getDefault60(): UserConfiguration {
        if (!this._defaultConfig60) {
            this._defaultConfig60 = new UserConfiguration()
                .fromJsonObject(UHK_60_USER_CONFIG);
        }

        return this._defaultConfig60;
    }

    getDefault80(): UserConfiguration {
        if (!this._defaultConfig80) {
            this._defaultConfig80 = new UserConfiguration()
                .fromJsonObject(UHK_80_USER_CONFIG);
        }

        return this._defaultConfig80;
    }

    getDefaultUserConfigurationOfUhkDeviceProduct(uhkDeviceProduct: UhkDeviceProduct): UserConfiguration {
        return uhkDeviceProduct?.id === UHK_80_DEVICE.id
            ? this.getDefault80().clone()
            : this.getDefault60().clone();
    }

    getResetUserConfiguration(uhkDeviceProduct: UhkDeviceProduct): UserConfiguration {
        const config = this.getDefaultUserConfigurationOfUhkDeviceProduct(uhkDeviceProduct)

        config.keymaps = config.keymaps.filter(keymap => keymap.abbreviation !== 'EMP');

        return config;
    }
}
