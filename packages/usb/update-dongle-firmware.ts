#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { existsSync } from 'fs';
import { UHK_DONGLE } from 'uhk-common';
import { getUhkDongles } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async () => {
    try {
        const argv = yargs
            .scriptName('./update-dongle-firmware')
            .usage('Usage: $0 <firmware path>')
            .demandCommand(1, 'Firmware path is required')
            .argv as any;

        const firmwarePath = argv._[0];

        if (!existsSync(firmwarePath)) {
            console.log('Firmware path does not exists.');
            process.exit(1);
        }

        const dongles = getUhkDongles();

        if (dongles.length === 0) {
            console.log('UHK Dongle not connected');
            process.exit(1);
        }

        if (dongles.length > 1) {
            console.log('More then 1 UHK Dongle connected');
            process.exit(1) ;
        }

        const { operations } = Uhk(argv);
        console.log(`Updating Dongle firmware from ${firmwarePath} ...`);
        await operations.updateDeviceFirmware(firmwarePath, UHK_DONGLE);
        console.log('Firmware updated.');
        console.log('Reenumerating device...');

    } catch (error) {
        errorHandler(error);
    }
})();
