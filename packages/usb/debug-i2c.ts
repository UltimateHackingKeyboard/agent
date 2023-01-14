#!/usr/bin/env ../../node_modules/.bin/ts-node-esm
import { EOL } from 'os';
import { getFormattedTimestamp } from 'uhk-common';

import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .usage('Every second, check the I2cRecovery value and display its increment if it has been incremented.')
    .argv;

const { operations } = Uhk(argv);
let i2cRecovery;

setInterval(async function () {
    try {

        const debugInfo = await operations.getDebugInfo();
        if (i2cRecovery !== debugInfo.i2cWatchdogRecoveryCounter) {
            process.stdout.write(`${getFormattedTimestamp()} I2cRecovery: ${debugInfo.i2cWatchdogRecoveryCounter}${EOL}`);
            i2cRecovery = debugInfo.i2cWatchdogRecoveryCounter;
        }
    } catch (error) {
        errorHandler(error);
    }
}, 1000);
