#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

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
