import { join } from 'path';
import { LogService } from 'uhk-common';
import { UhkBlhost, UhkHidDevice, UhkOperations } from 'uhk-usb';

export interface Uhk {
    device: UhkHidDevice;
    logger: LogService;
    operations: UhkOperations;
}
const tmpDir = join(__dirname, '../../tmp');

export default function (options: any = {}): Uhk {
    const logger = new LogService();
    logger.setLogOptions({});

    const device = new UhkHidDevice(logger, options, tmpDir);
    const uhkBlhost = new UhkBlhost(logger, tmpDir);
    const operations = new UhkOperations(logger, uhkBlhost, device);

    return {
        device,
        logger,
        operations
    };
}
