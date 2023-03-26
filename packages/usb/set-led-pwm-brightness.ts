#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

(async () => {
    try {
        const argv = yargs
            .scriptName('./set-led-pwm-brightness.ts')
            .usage('Usage: $0 <percent>')
            .demandCommand(1, 'Percent is required')
            .argv as any;

        const { operations } = Uhk(argv);

        await operations.setLedPwmBrightness(argv._[0]);

    } catch (error) {
        errorHandler(error);
    }
})();
