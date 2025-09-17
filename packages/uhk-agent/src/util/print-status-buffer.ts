import process from 'node:process';
import { UhkOperations, UsbVariables } from 'uhk-usb';

import { ElectronLogService } from '../services/logger.service';

export interface PrintStatusBufferOptions {
    logger: ElectronLogService;
    uhkOperations: UhkOperations;
}

export async function printStatusBuffer({logger, uhkOperations}: PrintStatusBufferOptions): Promise<void> {
    try {
        const message = await uhkOperations.getVariable(UsbVariables.statusBuffer);
        logger.misc(`Status buffer: ${message}`);
        process.exit(0);
    }
    catch (error) {
        logger.error(error.message);
        process.exit(-1);
    }
}
