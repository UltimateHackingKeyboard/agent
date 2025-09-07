import process from 'node:process';
import { UhkOperations } from 'uhk-usb';

import { ElectronLogService } from '../services/logger.service';

export interface PrintHardwareConfigurationOptions {
    logger: ElectronLogService;
    uhkOperations: UhkOperations;
}

export async function printHardwareConfiguration({logger, uhkOperations}: PrintHardwareConfigurationOptions): Promise<void> {
    try {
        const hardwareConfiguration = await uhkOperations.getHardwareConfiguration()
        logger.misc(hardwareConfiguration.toJsonObject());
        process.exit(0);
    }
    catch (error) {
        logger.error(error.message);
        process.exit(-1);
    }
}
