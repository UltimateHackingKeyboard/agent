#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async () => {
    try {
        const argv = yargs
            .usage('Query the maximum size of the user and hardware configuration')
            .argv;

        const { operations } = Uhk(argv);
        const configs = await operations.getConfigSizesFromKeyboard();

        console.log(`hardwareConfigMaxSize: ${configs.hardwareConfig}`);
        console.log(`userConfigMaxSize: ${configs.userConfig}`);
    } catch (error) {
        errorHandler(error);
    }
})();
