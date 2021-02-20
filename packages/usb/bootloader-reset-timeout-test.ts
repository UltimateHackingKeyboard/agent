#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import { Constants, EnumerationModes, waitForDevice } from 'uhk-usb';
import { KBoot, UsbPeripheral } from '../kboot';

(async function () {
    try {
        const argv = yargs
            .usage('Test 2 bootloader timeout after KBoot reset command')
            .argv;

        const { device, operations } = Uhk(argv);
        console.info('Start Bootloader re-enumeration with 60 sec');

        await device.reenumerate({
            enumerationMode: EnumerationModes.Bootloader,
            timeout: 60000,
            vid: Constants.VENDOR_ID,
            pid: Constants.BOOTLOADER_ID
        });

        console.info('Kboot reset');
        const kboot = new KBoot(new UsbPeripheral({ vendorId: Constants.VENDOR_ID, productId: Constants.BOOTLOADER_ID }));
        await kboot.reset();

        console.info('Wait for Keyboard');

        await waitForDevice(Constants.VENDOR_ID, Constants.PRODUCT_ID);

    } catch (error) {
        errorHandler(error);
    }
})();
