#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { devices as HidDevices} from 'node-hid';
import { SerialPort} from 'serialport';
import {
    UHK_80_DEVICE,
    UHK_80_DEVICE_LEFT,
    UHK_DEVICES,
    UhkDeviceProduct,
} from 'uhk-common';
import {
    EnumerationModes,
    isUhkCommunicationUsage,
} from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .scriptName('./reenumerate.ts')
            .usage('Usage: $0 <mode>')
            .demandCommand(1, 'Reenumeration mode required')
            .option('timeout', {
                type: 'number',
                description: 'Enumeration timeout',
                default: 5000,
                alias: 't'
            })
            .argv;

        const mode = argv._[0];

        if (!Object.values(EnumerationModes).includes(mode)) {
            const keys = Object.keys(EnumerationModes)
                .filter((key: any) => isNaN(key))
                .join(', ');
            console.error(`The specified enumeration mode does not exist. Specify one of ${keys}`);
            process.exit(1);
        }
        const enumerationMode = EnumerationModes[mode];
        const uhkDeviceProduct = await getCurrentUhkDeviceProduct();

        const { device } = Uhk(argv);
        await device.reenumerate({
            device: uhkDeviceProduct,
            enumerationMode,
            timeout: argv.timeout});
    } catch (error) {
        errorHandler(error);
    }
})();

async function getCurrentUhkDeviceProduct(): Promise<UhkDeviceProduct | undefined> {
    let uhkDeviceProduct: UhkDeviceProduct;

    function setUhkDeviceProduct(device: UhkDeviceProduct) {
        if (uhkDeviceProduct) {
            throw new Error('Multiple devices aren\'t supported yet, so please connect only a single device to proceed further.');
        }

        uhkDeviceProduct = device;
    }

    const hidDevices = HidDevices();
    const allUhkDevice = [
        ...UHK_DEVICES,
        UHK_80_DEVICE_LEFT,
    ];

    for (const hidDevice of hidDevices) {
        for (const uhkDevice of allUhkDevice) {
            if (uhkDevice.bootloader.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId) ||
                (uhkDevice.keyboard.some(vidPid => vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId) && isUhkCommunicationUsage(hidDevice))
            ) {
                setUhkDeviceProduct(uhkDevice);
            }
        }
    }

    const serialDevices = await SerialPort.list();

    const uhk80Devices = [
        UHK_80_DEVICE_LEFT,
        UHK_80_DEVICE
    ];

    for (const serialDevice of serialDevices) {
        for (const uhkDevice of uhk80Devices) {
            if (uhkDevice.bootloader.some(vidPid => Number.parseInt(serialDevice.vendorId, 16) === vidPid.vid && Number.parseInt(serialDevice.productId, 16) === vidPid.pid)) {
                setUhkDeviceProduct(uhkDevice);
            }
        }
    }

    if (!uhkDeviceProduct) {
        throw new Error('Can not find connected device');
    }

    return uhkDeviceProduct;
}
