#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .usage('Erase user configuration')
            .argv;

        const { operations } = Uhk(argv);
        await operations.eraseUserConfig();
    } catch (error) {
        errorHandler(error);
    }
})();
