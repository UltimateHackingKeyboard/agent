import process from 'node:process';
import { CommandLineArgs } from 'uhk-common';
import {
    getCurrentUhkDeviceProduct,
    UhkOperations,
} from 'uhk-usb';

import { ElectronLogService } from '../services/logger.service';

export interface WriteHardwareConfigurationOptions {
    commandLineArgs: CommandLineArgs;
    logger: ElectronLogService;
    uhkOperations: UhkOperations;
}

export async function writeHardwareConfiguration(options: WriteHardwareConfigurationOptions):Promise<void> {
    const layout = options.commandLineArgs['write-hardware-configuration'];
    options.logger.misc(`[writeHardwareConfiguration] Command line argument: ${layout}`);

    if (!['ansi', 'iso'].includes(layout)) {
        options.logger.misc('Invalid layout. Layout should be either iso or ansi');
        process.exit(-1);
    }

    try {
        const device = await getCurrentUhkDeviceProduct(options.commandLineArgs);

        await options.uhkOperations.saveHardwareConfiguration(layout === 'iso', device.id)

        options.logger.misc(`[writeHardwareConfiguration] finished successfully.`);
        process.exit(0);
    } catch (error) {
        options.logger.error(error.message);
        process.exit(-1);
    }

}
