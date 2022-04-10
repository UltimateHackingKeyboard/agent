#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import * as path from 'path';
import { getCurrentUhkDeviceProduct, getDeviceFirmwarePath, getFirmwarePackageJson } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Upgrade firmwares')
            .argv;

        const uhkDeviceProduct = getCurrentUhkDeviceProduct();

        const { operations } = Uhk(argv);
        const firmwareDir = path.join('../../tmp/packages/firmware');
        const packageJsonPath = path.join('../../tmp/packages/firmware/package.json');
        const packageJson = await getFirmwarePackageJson({
            packageJsonPath,
            tmpDirectory: firmwareDir
        });
        const rightFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);

        await operations.updateRightFirmwareWithKboot(rightFirmwarePath, uhkDeviceProduct);
        const leftFirmwarePath = path.join(firmwareDir, 'modules/uhk60-left.bin');
        await operations.updateLeftModuleWithKboot(leftFirmwarePath, uhkDeviceProduct);
    } catch (error) {
        errorHandler(error);
    }
})();
