#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import fs from 'fs';
import * as path from 'path';
import { LEFT_HALF_MODULE } from 'uhk-common';
import { getCurrentUhkDeviceProduct, getDeviceFirmwarePath, getFirmwarePackageJson } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Usage: $0 <firmware directory>')
            .argv;

        const firmwarePath = argv._[0];

        if (!fs.existsSync(firmwarePath)) {
            console.log('Firmware directory does not exists.');
            process.exit(1);
        }

        const uhkDeviceProduct = await getCurrentUhkDeviceProduct(argv);

        const { operations } = Uhk(argv);

        const packageJsonPath = path.join(firmwarePath, 'package.json');
        const packageJson = await getFirmwarePackageJson({
            packageJsonPath,
            tmpDirectory: firmwarePath
        });
        const rightFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);

        await operations.updateRightFirmwareWithKboot(rightFirmwarePath, uhkDeviceProduct);
        const leftFirmwarePath = path.join(firmwarePath, 'modules/uhk60-left.bin');
        await operations.updateModuleWithKbootNative(leftFirmwarePath, uhkDeviceProduct, LEFT_HALF_MODULE);
    } catch (error) {
        await errorHandler(error);
    }
})();
