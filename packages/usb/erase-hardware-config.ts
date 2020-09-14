#!/usr/bin/env ts-node-script
import Uhk, { errorHandler, yargs } from './src';

(async function () {
    try {
        const argv = yargs
            .usage('Erase hardware configuration')
            .argv;

        const { operations } = Uhk(argv);
        await operations.eraseHardwareConfig();
    } catch (error) {
        errorHandler(error);
    }
})();
