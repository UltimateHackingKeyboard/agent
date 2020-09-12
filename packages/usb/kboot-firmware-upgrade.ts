import * as path from 'path';
import { LogService } from 'uhk-common';
import { UhkHidDevice, UhkOperations } from 'uhk-usb';

// const logService = new LogService();
// const rootDir = path.join(__dirname, '../../tmp');
// const uhkHidDevice = new UhkHidDevice(logService, {}, rootDir);
// const uhkOperations = new UhkOperations(logService, uhkHidDevice, rootDir);
//
// process.on('uncaughtException', error => {
//     console.error('uncaughtException',  error);
//     process.exit(1);
// });
//
// process.on('unhandledRejection', (reason: any, promise: Promise<any>): void => {
//     console.error('unhandledRejection', { reason, promise });
// });
//
// uhkOperations
//     .updateRightFirmwareWithKboot()
//     .then(() => uhkOperations.updateLeftModuleWithKboot())
//     .then(() => console.log('Firmware upgrade finished'))
//     .catch(error => {
//         console.error(error);
//         process.exit(-1);
//     });
