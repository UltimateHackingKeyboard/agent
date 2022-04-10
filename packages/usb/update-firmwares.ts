#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import * as path from 'path';
import * as fs from 'fs';
import { getCurrentUhkDeviceProduct, getDeviceFirmwarePath, getFirmwarePackageJson } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async () => {
    try {
        const argv = yargs
            .scriptName('./update-firmwares.ts')
            .usage('Usage: $0 <firmware directory>')
            .demandCommand(1, 'Firmware path is required')
            .option('overwrite-user-config', {
                alias: 'u',
                description: 'Overwrite the user configuration with the one that is bundled with the firmware',
                type: 'boolean',
                default: false
            })
            .argv as any;

        const firmwarePath = argv._[0];

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

        const { operations } = Uhk(argv);
        await operations.updateRightFirmwareWithKboot(rightFirmwarePath, uhkDeviceProduct);
        await operations.updateLeftModuleWithKboot(leftFirmwarePath, uhkDeviceProduct);

        if (argv['overwrite-user-config']) {
            const userConfigPath = path.join(firmwarePath, '/devices/uhk60-right/config.bin');
            if (!fs.existsSync(userConfigPath)) {
                console.error('User configuration path not found!');
                process.exit(1);
            }

            const configBuffer = fs.readFileSync(userConfigPath) as any;
            await operations.saveUserConfiguration(configBuffer);
        }
    } catch (error) {
        errorHandler(error);
    }
})();
