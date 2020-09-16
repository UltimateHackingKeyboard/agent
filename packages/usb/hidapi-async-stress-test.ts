#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

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
