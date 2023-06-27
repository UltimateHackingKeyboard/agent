#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .usage('Apply Configuration')
            .argv;

        const { operations } = Uhk(argv);
        await operations.applyConfiguration();
    } catch (error) {
        errorHandler(error);
    }
})();
