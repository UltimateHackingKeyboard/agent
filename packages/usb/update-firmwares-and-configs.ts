#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import * as path from 'path';
import * as fs from 'fs';
import { getCurrentUhkDeviceProduct, getDeviceFirmwarePath, getFirmwarePackageJson } from 'uhk-usb';

import Uhk, { errorHandler, getDeviceIdFromArg, yargs } from './src';

(async () => {
    try {
        const argv = yargs
            .scriptName('./update-firmwares-and-configs.ts')
            .usage('Usage: $0 <firmware directory> {uhk60v1|uhk60v2} {iso|ansi}')
            .demandCommand(2, 'Both firmwarePath and layout must be specified.')
            .argv as any;

        const firmwarePath = argv._[0];
        const deviceId = getDeviceIdFromArg(argv._[1] as string);
        const layout = argv._[2];

        if (!fs.existsSync(firmwarePath)) {
            console.log('Firmware directory does not exists.');
            process.exit(1);
        }

        const uhkDeviceProduct = getCurrentUhkDeviceProduct();

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

        const leftFirmwarePath = path.join(firmwarePath, '/modules/uhk60-left.bin');
        if (!fs.existsSync(leftFirmwarePath)) {
            console.error('Left firmware path not found!');
            process.exit(1);
        }

        const userConfigPath = path.join(firmwarePath, '/devices/uhk60-right/config.bin');
        if (!fs.existsSync(userConfigPath)) {
            console.error('User configuration path not found!');
            process.exit(1);
        }

        if (!['ansi', 'iso'].includes(layout)) {
            console.error('The specified layout is neither ansi nor iso.');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.updateRightFirmwareWithKboot(rightFirmwarePath, uhkDeviceProduct);
        await operations.updateLeftModuleWithKboot(leftFirmwarePath, uhkDeviceProduct);
        const configBuffer = fs.readFileSync(userConfigPath) as any;
        await operations.saveUserConfiguration(configBuffer);
        await operations.saveHardwareConfiguration(layout === 'iso', deviceId);

    } catch (error) {
        errorHandler(error);
    }
})();
