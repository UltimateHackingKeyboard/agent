#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

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
        errorHandler(error);
    }
})();
