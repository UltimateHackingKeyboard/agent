#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import * as path from 'path';
import { getCurrentUhkDeviceProduct, getDeviceFirmwareInfo, getFirmwarePackageJson } from 'uhk-usb';

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
        const rightFirmwareInfo = getDeviceFirmwareInfo(uhkDeviceProduct, packageJson);

        await operations.updateRightFirmwareWithKboot(rightFirmwareInfo.path, uhkDeviceProduct);
        const leftFirmwarePath = path.join(firmwareDir, 'modules/uhk60-left.bin');
        await operations.updateLeftModuleWithKboot(leftFirmwarePath, uhkDeviceProduct);
    } catch (error) {
        errorHandler(error);
    }
})();
