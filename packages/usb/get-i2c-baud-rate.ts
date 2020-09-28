#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async function () {

    try {

        const argv = yargs
            .usage('Read I2C Baud rate')
            .argv;

        const { operations } = Uhk(argv);
        const baudRate = await operations.getI2CBaudRate();

        // tslint:disable-next-line:max-line-length
        console.log(`requestedBaudRate:${baudRate.requestedBaudRate} | actualBaudRate:${baudRate.actualBaudRate} | I2C0_F:0b${baudRate.i2c0F}`);
    } catch (error) {
        errorHandler(error);
    }
})();
