import { Provider } from '@angular/core';

import { UhkDeviceService } from './uhk-device.service';
import { UhkHidApiService } from './uhk-hid-api.service';

export function uhkDeviceProvider(): Provider {
    // HID API officially support MAC, WIN and linux x64 platform
    // https://github.com/node-hid/node-hid#platform-support
    if (process.platform === 'darwin' ||
        process.platform === 'win32' ||
        (process.platform === 'linux' && process.arch === 'x64')) {
        return { provide: UhkDeviceService, useClass: UhkHidApiService };
    }

    // On other platform use libUsb, but we try to test on all platform
    // return { provide: UhkDeviceService, useClass: UhkLibUsbApiService };
    return { provide: UhkDeviceService, useClass: UhkHidApiService };
}
