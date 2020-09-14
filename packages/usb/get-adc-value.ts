#!/usr/bin/env ts-node-script

import { bufferToString } from 'uhk-usb';
import Uhk, { errorHandler, yargs } from './src';

const argv = yargs
    .usage('Periodically read the ADC value')
    .argv;

const { operations } = Uhk(argv);

setInterval(async function () {
    try {
        const receivedBuffer = await operations.getAdcValue();

        console.log(
            'Received',
            bufferToString(receivedBuffer),
            (receivedBuffer[2] * 255 + receivedBuffer[1]) / 4096 * 5.5 * 1.045
        );
    } catch (error) {
        errorHandler(error);
    }
}, 500);
