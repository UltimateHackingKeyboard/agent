#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { UhkHidDevice } from 'uhk-usb';
import { getCurrentUhkDongleHID } from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .scriptName('./pair-device-to-dongle.ts')
    .usage('Pair UHK 80 Right half to UHK Dongle')
    .argv as any;

const { logger, rootDir, operations, device } = Uhk(argv);

try {
    const dongleHidDevice = await getCurrentUhkDongleHID();
    if (!dongleHidDevice) {
        console.log('Dongle device is not found');
        process.exit(1);
    }

    const dongleUhkDevice = new UhkHidDevice(
        logger,
        argv,
        rootDir,
        dongleHidDevice
    );
    await operations.pairToDongle(dongleUhkDevice);
} catch (error) {
    await errorHandler(error);
}
