#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .scriptName('./set-i2c-baud-rate.ts')
            .usage(`Usage: $0 <baud rate in Hz>
Adjust the frequency of the main I2C bus via which the right keyboard half communicates with the left half and the add-on modules.
Example values:
    * 400000 Hz - Highest speed. This will probably make communication unreliable. Not recommended.
    * 100000 Hz - Default speed. Should work in most cases.
    * 10000 Hz - Low speed. Should help when connection is spotty. It'll make initial LED display updates visibly slower.
You're free to use any value in between and test the results.`)
            .demandCommand(1, 'Baud rate required')
            .argv;

        const baudRate = parseInt(argv._[0]);

        if (isNaN(baudRate)) {
            console.error('Baud rate must be a number');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.setI2CBaudRate(baudRate);
    } catch (error) {
        errorHandler(error);
    }
})();
