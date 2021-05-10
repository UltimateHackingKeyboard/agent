#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import * as fs from 'fs';
import {
    mapI2cAddressToModuleName,
    mapI2cAddressToSlotId,
    UhkModule
} from 'uhk-common';
import { getCurrentUhkDeviceProduct } from 'uhk-usb';
import Uhk, { getI2cAddressArgs, getI2cAddressFromArg, errorHandler, yargs } from './src';

(async () => {
    try {
        const argv = yargs
            .scriptName('./update-module-firmware.ts')
            .usage(`Usage: $0 {${getI2cAddressArgs()}} <firmwarePath>`)
            .demandCommand(2, 'i2cAddress and firmwarePath are required')
            .argv as any;

        const i2cAddress = getI2cAddressFromArg(argv._[0]);
        const firmwarePath = argv._[1];

        if (!fs.existsSync(firmwarePath)) {
            console.error('Firmware path not found');
            process.exit(1);
        }

        const uhkModule: UhkModule = {
            i2cAddress,
            id: -1,
            slotId: mapI2cAddressToSlotId(i2cAddress),
            name: mapI2cAddressToModuleName(i2cAddress),
            firmwareUpgradeSupported: true
        };
        const uhkDeviceProduct = getCurrentUhkDeviceProduct();
        const { operations } = Uhk(argv);
        console.log(`Updating ${uhkModule.name} module from ${firmwarePath} ...`);
        await operations.updateModuleWithKboot(
            firmwarePath,
            uhkDeviceProduct,
            uhkModule
        );
        console.log('Firmware updated.');

    } catch (error) {
        errorHandler(error);
    }
})();
