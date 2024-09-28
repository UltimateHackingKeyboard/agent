#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .usage('Run HIDAPI stress test')
    .argv;

const { operations } = Uhk(argv);

(async function () {
    try {
        let counter = 0;

        while (true) {
            console.log(`hidapi sync test ${counter++}`);
            await operations.getConfigSizesFromKeyboard();
        }
    } catch (error) {
        await errorHandler(error);
    }
})();
