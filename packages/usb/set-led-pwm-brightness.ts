#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async () => {
    try {
        const argv = yargs
            .scriptName('./set-led-pwm-brightness.ts')
            .usage('Usage: $0 <percent>')
            .demandCommand(1, 'Percent is required')
            .argv as any;

        console.log(argv);
        const { operations } = Uhk(argv);

        await operations.setLedPwmBrightness(argv._[0]);

    } catch (error) {
        errorHandler(error);
    }
})();
