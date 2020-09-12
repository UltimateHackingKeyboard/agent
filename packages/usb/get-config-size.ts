#!/usr/bin/env node -r ts-node/register/transpile-only

import Uhk, { errorHandler, CliOption } from './src';

(async () => {
    try {
        const cliOption: CliOption = {
            description: 'Query the maximum size of the user and hardware configuration'
        };

        const { operations } = Uhk(cliOption);
        const configs = await operations.getConfigSizesFromKeyboard();

        console.log(`hardwareConfigMaxSize: ${configs.hardwareConfig}`);
        console.log(`userConfigMaxSize: ${configs.userConfig}`);
    } catch (error) {
        errorHandler(error);
    }
})();
