import { UhkOperations } from 'uhk-usb';

import { ElectronLogService } from '../services/logger.service';

export interface PrintHardwareConfigurationOptions {
    logger: ElectronLogService;
    uhkOperations: UhkOperations;
}

export async function printHardwareConfiguration({logger, uhkOperations}: PrintHardwareConfigurationOptions): Promise<void> {
    const hardwareConfiguration = await uhkOperations.getHardwareConfiguration()
    logger.misc(hardwareConfiguration.toJsonObject());
}
