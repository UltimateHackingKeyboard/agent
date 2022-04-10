#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import Uhk, { errorHandler, yargs } from './src/index.js';
import { EnumerationModes, waitForDevice } from 'uhk-usb';
import { KBoot, UsbPeripheral } from '../kboot/src/index.js';
import { UHK_60_DEVICE } from 'uhk-common';

(async function () {
    try {
        const argv = yargs
            .usage('Test 2 bootloader timeout after KBoot reset command')
            .argv;

        const { device } = Uhk(argv);
        console.info('Start Bootloader re-enumeration with 60 sec');

        await device.reenumerate({
            enumerationMode: EnumerationModes.Bootloader,
            timeout: 60000,
            vendorId: UHK_60_DEVICE.vendorId,
            productId: UHK_60_DEVICE.bootloaderPid
        });

        console.info('Kboot reset');
        const kboot = new KBoot(new UsbPeripheral({ vendorId: UHK_60_DEVICE.vendorId, productId: UHK_60_DEVICE.bootloaderPid }));
        await kboot.reset();

        console.info('Wait for Keyboard');

        await waitForDevice(UHK_60_DEVICE.vendorId, UHK_60_DEVICE.keyboardPid);

    } catch (error) {
        errorHandler(error);
    }
})();
