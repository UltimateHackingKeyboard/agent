import { join } from 'path';
import { LogService } from 'uhk-common';
import { UhkBlhost, UhkHidDevice, UhkOperations } from 'uhk-usb';

import { CliOption, parseCommandLine } from './command-line';
import { parseLoggingOptions } from './parse-logging-options';

export interface Uhk {
    parsedArgs: any;
    device: UhkHidDevice;
    logger: LogService;
    operations: UhkOperations;
    usage: any;
}

const tmpDir = join(__dirname, '../../tmp');

export default function (options: CliOption = { description: '', args: [] }): Uhk {
    const { options: parsedArgs, usage } = parseCommandLine(options);
    const logger = new LogService();
    logger.setLogOptions(parseLoggingOptions(parsedArgs.log));

    const device = new UhkHidDevice(logger, parsedArgs, tmpDir);
    const uhkBlhost = new UhkBlhost(logger, tmpDir);
    const operations = new UhkOperations(logger, uhkBlhost, device);

    return {
        device,
        logger,
        operations,
        parsedArgs,
        usage
    };
}
