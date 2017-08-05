import { LogService } from 'uhk-common';
import { UhkDeviceService } from './uhk-device.service';
import { UhkHidApiService } from './uhk-hid-api.service';

export function uhkDeviceFactory(logService): UhkDeviceService {
    // HID API officially support MAC, WIN and linux x64 platform
    // https://github.com/node-hid/node-hid#platform-support
    if (process.platform === 'darwin' ||
        process.platform === 'win32' ||
        (process.platform === 'linux' && process.arch === 'x64')) {
        return new UhkHidApiService(logService);
    }

    // On other platform use libUsb, but we try to test on all platform
    // return new UhkLibUsbApiService(logService);
    return new UhkHidApiService(logService);
}
