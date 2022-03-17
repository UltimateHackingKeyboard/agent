#!/usr/bin/env ../../node_modules/.bin/ts-node-script
import { EOL } from 'os';

import Uhk, { errorHandler, yargs } from './src';

const argv = yargs
    .usage('Every second, check the I2cRecovery value and display its increment if it has been incremented.')
    .argv;

const { operations } = Uhk(argv);
const dateFormat = new Intl.DateTimeFormat('sv-SE',{
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});
let i2cRecovery;

setInterval(async function () {
    try {

        const debugInfo = await operations.getDebugInfo();
        if (i2cRecovery !== debugInfo.i2cWatchdogRecoveryCounter) {
            const sign = debugInfo.i2cWatchdogRecoveryCounter === 0 ? '' : '+';
            process.stdout.write(`${getTimestamp()} I2cRecovery: ${sign}${debugInfo.i2cWatchdogRecoveryCounter}${EOL}`);
            i2cRecovery = debugInfo.i2cWatchdogRecoveryCounter;
        }
    } catch (error) {
        errorHandler(error);
    }
}, 1000);

function getTimestamp() {
    return dateFormat.format(new Date());
}
