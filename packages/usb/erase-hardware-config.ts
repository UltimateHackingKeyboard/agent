#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning
import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Erase hardware configuration')
            .argv;

        const { operations } = Uhk(argv);
        await operations.eraseHardwareConfig();
    } catch (error) {
        await errorHandler(error);
    }
})();
