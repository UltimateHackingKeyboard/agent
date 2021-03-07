#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import * as fs from 'fs';
import {
    mapI2cAddressToModuleName,
    mapI2cAddressToSlotId,
    ModuleSlotToI2cAddress,
    toHexString,
    UhkModule,
    UhkProductTypes
} from 'uhk-common';
import { getCurrentUhkDeviceProduct } from 'uhk-usb';
import Uhk, { errorHandler, yargs } from './src';

(async () => {
    try {
        const argv = yargs
            .scriptName('./update-module-firmware.ts')
            .usage('Usage: $0 <i2cAddress> <firmwarePath>')
            .demandCommand(2, 'moduleSlot and firmwarePath are required')
            .argv as any;

        const i2cAddress = argv._[0];
        const firmwarePath = argv._[1];

        if (!fs.existsSync(firmwarePath)) {
            console.error('Firmware path not found');
            process.exit(1);
        }

        if (!Object.values(ModuleSlotToI2cAddress).includes(i2cAddress)) {
            const keys = Object.keys(ModuleSlotToI2cAddress)
                .filter((key: any) => !isNaN(key))
                .map(key => toHexString(key as any))
                .join(', ');
            console.error(`The specified I2C address does not exist. Specify one of ${keys}`);
            process.exit(1);
        }

        const uhkModule: UhkModule = {
            i2cAddress,
            type: UhkProductTypes.Module,
            id: -1,
            slotId: mapI2cAddressToSlotId(i2cAddress),
            name: mapI2cAddressToModuleName(i2cAddress),
            slotName: mapI2cAddressToModuleName(i2cAddress),
            firmwareUpgradeSupported: true,
            bootloaderPingReconnectMsg: 'Cannot ping the bootloader. Please remove the bridge cable/module, and keep reconnecting until you see this message.'
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
