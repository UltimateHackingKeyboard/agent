#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import * as path from 'path';
import * as fs from 'fs';
import {
    FIRMWARE_UPGRADE_METHODS,
    LEFT_HALF_MODULE,
    UHK_80_DEVICE_LEFT,
} from 'uhk-common';
import { waitForUhkDeviceConnected } from 'uhk-usb';
import { isUhkDeviceConnected } from 'uhk-usb';
import {
    getCurrentUhkDeviceProduct,
    getDeviceFirmwarePath,
    getDeviceUserConfigPath,
    getFirmwarePackageJson,
    getModuleFirmwarePath
} from 'uhk-usb';

import Uhk, { errorHandler, getDeviceIdFromArg, yargs } from './src/index.js';

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

        const leftFirmwarePath = uhkDeviceProduct.firmwareUpgradeMethod === FIRMWARE_UPGRADE_METHODS.MCUBOOT
            ? getDeviceFirmwarePath(UHK_80_DEVICE_LEFT, packageJson)
            : getModuleFirmwarePath(LEFT_HALF_MODULE, packageJson);

        if (!fs.existsSync(leftFirmwarePath)) {
            console.error('Left firmware path not found!');
            process.exit(1);
        }

        const userConfigPath = getDeviceUserConfigPath(uhkDeviceProduct, packageJson);
        if (!fs.existsSync(userConfigPath)) {
            console.error('User configuration path not found!');
            process.exit(1);
        }

        if (!['ansi', 'iso'].includes(layout)) {
            console.error('The specified layout is neither ansi nor iso.');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.updateDeviceFirmware(rightFirmwarePath, uhkDeviceProduct);
        if (uhkDeviceProduct.firmwareUpgradeMethod === FIRMWARE_UPGRADE_METHODS.MCUBOOT) {
            if (!(await isUhkDeviceConnected(UHK_80_DEVICE_LEFT))) {
                console.log(`[DeviceService] Please connect your ${UHK_80_DEVICE_LEFT.logName} keyboard with USB cable.`);
            }
            await waitForUhkDeviceConnected(UHK_80_DEVICE_LEFT);

            await operations.updateFirmwareWithMcuManager(leftFirmwarePath, UHK_80_DEVICE_LEFT);

            if (!(await isUhkDeviceConnected(uhkDeviceProduct))) {
                console.log(`[DeviceService] Please connect your ${uhkDeviceProduct.logName} keyboard with USB cable.`);
            }
            await waitForUhkDeviceConnected(uhkDeviceProduct);
        }
        else {
            await operations.updateLeftModuleWithKboot(leftFirmwarePath, uhkDeviceProduct);
        }
        const configBuffer = fs.readFileSync(userConfigPath) as any;
        await operations.saveUserConfiguration(configBuffer);
        await operations.saveHardwareConfiguration(layout === 'iso', deviceId);

    } catch (error) {
        errorHandler(error);
    }
})();
