import { join } from 'path';
import { LogService } from 'uhk-common';
import { UhkBlhost, UhkHidDevice, UhkOperations } from 'uhk-usb';

import { parseLoggingOptions } from './parse-logging-options';

export interface Uhk {
    device: UhkHidDevice;
    logger: LogService;
    operations: UhkOperations;
}

const tmpDir = join(__dirname, '../../tmp');

export default function (argv: any): Uhk {
    const logger = new LogService();
    logger.setLogOptions(parseLoggingOptions(argv.log));

    const device = new UhkHidDevice(logger, argv, tmpDir);
    const uhkBlhost = new UhkBlhost(logger, tmpDir);
    const operations = new UhkOperations(logger, uhkBlhost, device);

    return {
        device,
        logger,
        operations
    };
}
