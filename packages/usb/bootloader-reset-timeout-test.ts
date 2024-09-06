#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';
import { EnumerationModes, waitForDevices } from 'uhk-usb';
import { KBoot, UsbPeripheral } from '../kboot/src/index.js';
import { UHK_60_DEVICE } from 'uhk-common';

(async function () {
    try {
        const argv = yargs
            .usage('Test 2 bootloader timeout after KBoot reset command')
            .argv;

        const { device } = Uhk(argv);
        console.info('Start Bootloader re-enumeration with 60 sec');

        const reenumerateResult = await device.reenumerate({
            device: UHK_60_DEVICE,
            enumerationMode: EnumerationModes.Bootloader,
            timeout: 60000,
        });

        console.info('Kboot reset');
        const kboot = new KBoot(new UsbPeripheral({ vendorId: reenumerateResult.vidPidPair.vid, productId: reenumerateResult.vidPidPair.pid }));
        await kboot.reset();

        console.info('Wait for Keyboard');

        await waitForDevices(UHK_60_DEVICE.keyboard);

    } catch (error) {
        errorHandler(error);
    }
})();
