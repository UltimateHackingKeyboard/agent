#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import * as path from 'path';
import * as fs from 'fs';
import {
    LEFT_HALF_MODULE,
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE,
} from 'uhk-common';
import {
    getCurrentUhkDeviceProduct,
    getDeviceFirmwarePath,
    getDeviceUserConfigPath,
    getFirmwarePackageJson,
    getModuleFirmwarePath,
    waitForDevices,
} from 'uhk-usb';

import Uhk, { errorHandler, getDevicesOptions, yargs } from './src/index.js';

const DEVICES = [
    UHK_60_DEVICE,
    UHK_60_V2_DEVICE,
];
const devicesOptions = getDevicesOptions(DEVICES);

(async function () {
    try {
        const argv = yargs
            .scriptName('./factory-update-uhk60.ts')
            .usage(`Usage: $0 <firmwarePath> {${devicesOptions}`)
            .demandCommand(2)
            .argv;

        const firmwarePath = argv._[0] as string;

        const uhkDeviceProduct = await getCurrentUhkDeviceProduct(argv);

        const packageJsonPath = path.join(firmwarePath, 'package.json');
        const packageJson = await getFirmwarePackageJson({
            packageJsonPath,
            tmpDirectory: firmwarePath
        });
        const rightFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);

        if (!fs.existsSync(rightFirmwarePath)) {
            console.error('Right firmware path not found!');
            process.exit(1);
        }

        const leftFirmwarePath = getModuleFirmwarePath(LEFT_HALF_MODULE, packageJson);

        if (!fs.existsSync(leftFirmwarePath)) {
            console.error('Left firmware path not found!');
            process.exit(1);
        }

        const userConfigPath = getDeviceUserConfigPath(uhkDeviceProduct, packageJson);
        if (!fs.existsSync(userConfigPath)) {
            console.error('User configuration path not found!');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.updateDeviceFirmware(rightFirmwarePath, uhkDeviceProduct);
        await waitForDevices(uhkDeviceProduct.keyboard);
        await operations.updateLeftModuleWithKboot(leftFirmwarePath, uhkDeviceProduct);
        const configBuffer = fs.readFileSync(userConfigPath) as any;
        await operations.saveUserConfiguration(configBuffer);
        console.log('All done!');
    } catch (error) {
        await errorHandler(error);
    }
})();
