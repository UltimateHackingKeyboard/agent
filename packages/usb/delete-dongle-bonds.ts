#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { getCurrentUhkDongleHID, UhkHidDevice } from 'uhk-usb';
import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .usage('Delete Dongle bonds')
    .argv;


const { logger, rootDir } = Uhk(argv);

try {
    const dongleHidDevice = await getCurrentUhkDongleHID();
    if (!dongleHidDevice) {
        console.log('Dongle device is not found');
        process.exit(1);
    }

    const dongleUhkDevice = new UhkHidDevice(
        logger,
        argv as any,
        rootDir,
        dongleHidDevice
    );

    await dongleUhkDevice.deleteAllBonds();
} catch (error) {
    await errorHandler(error);
}
