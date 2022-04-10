import { join } from 'desm';
import { LogService } from 'uhk-common';
import { UhkHidDevice, UhkOperations } from 'uhk-usb';

import { parseLoggingOptions } from './parse-logging-options.js';

export interface Uhk {
    device: UhkHidDevice;
    logger: LogService;
    operations: UhkOperations;
}

const tmpDir = join(import.meta.url, '../../tmp');

export default function (argv: any): Uhk {
    const logger = new LogService();
    logger.setLogOptions(parseLoggingOptions(argv.log));

    const device = new UhkHidDevice(logger, argv, tmpDir);
    const operations = new UhkOperations(logger, device);

    return {
        device,
        logger,
        operations
    };
}
