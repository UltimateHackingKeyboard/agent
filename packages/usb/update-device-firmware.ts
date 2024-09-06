#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';
import { existsSync } from 'fs';
import { getCurrentUhkDeviceProduct } from 'uhk-usb';

(async () => {
    try {
        const argv = yargs
            .scriptName('./update-device-firmware')
            .usage('Usage: $0 <firmware path>')
            .demandCommand(1, 'Firmware path is required')
            .argv as any;

        const firmwarePath = argv._[0];

        if (!existsSync(firmwarePath)) {
            console.log('Firmware path does not exists.');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        const uhkDeviceProduct = getCurrentUhkDeviceProduct();
        console.log(`Updating right firmware from ${firmwarePath} ...`);
        await operations.updateDeviceFirmware(firmwarePath, uhkDeviceProduct);
        console.log('Firmware updated.');
        console.log('Reenumerating device...');

    } catch (error) {
        errorHandler(error);
    }
})();
