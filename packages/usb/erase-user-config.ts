#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import Uhk, { errorHandler, yargs } from './src/index.js';

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
