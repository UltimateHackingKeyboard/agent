#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import fs from 'fs';
import { RIGHT_TRACKBALL_MODULE } from 'uhk-common';
import { getCurrentUhkDeviceProduct } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Usage: $0 <module-firmware.bin>')
            .demandCommand(1, 'Path to a module firmware .bin is required')
            .argv;

        const firmwarePath = argv._[0] as string;

        if (!fs.existsSync(firmwarePath) || !fs.statSync(firmwarePath).isFile()) {
            console.error(`Firmware file not found or not a file: ${firmwarePath}`);
            process.exit(1);
        }

        const uhkDeviceProduct = await getCurrentUhkDeviceProduct(argv);
        const { operations } = Uhk(argv);

        await operations.updateModuleWithKbootNative(firmwarePath, uhkDeviceProduct, RIGHT_TRACKBALL_MODULE);
    } catch (error) {
        await errorHandler(error);
    }
})();
