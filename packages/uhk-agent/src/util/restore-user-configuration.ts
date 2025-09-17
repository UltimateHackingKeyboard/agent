import process from 'node:process';
import {
    CommandLineArgs,
    mapObjectToUserConfigBinaryBuffer,
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE,
    UHK_60_USER_CONFIG,
    UHK_80_DEVICE,
    UHK_80_USER_CONFIG,
} from 'uhk-common';
import { getCurrentUhkDeviceProduct, UhkOperations } from 'uhk-usb';

import { ElectronLogService } from '../services/logger.service';

export interface RestoreUserConfigurationOptions {
    logger: ElectronLogService;
    uhkOperations: UhkOperations;
    commandLineArgs: CommandLineArgs;
}

export async function restoreUserConfiguration(options: RestoreUserConfigurationOptions): Promise<void> {
    try {
        const device = await getCurrentUhkDeviceProduct(options.commandLineArgs);
        let userConfigJson: any;

        if (!device) {
            options.logger.error('Cannot detect UHK device');
            process.exit(-1);
        }
        else if (device.id === UHK_60_DEVICE.id || device.id === UHK_60_V2_DEVICE.id) {
            userConfigJson = UHK_60_USER_CONFIG;
        }
        else if (device.id === UHK_80_DEVICE.id) {
            userConfigJson = UHK_80_USER_CONFIG;
        }
        else {
            options.logger.error(`Unknow UHK device: ${JSON.stringify(device)}`);
            process.exit(-1);
        }

        const buffer = mapObjectToUserConfigBinaryBuffer(userConfigJson);

        options.logger.misc('Start restoring user configuration...');
        await options.uhkOperations.saveUserConfiguration(buffer)
        options.logger.misc('User configuration restored.');

        process.exit(0);
    }
    catch (error) {
        options.logger.error(error.message);
        process.exit(-1);
    }
}
