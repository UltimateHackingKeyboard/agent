#!/usr/bin/env ts-node

import Uhk, { errorHandler, CliOption } from './src';

(async () => {
    try {
        const cliOption: CliOption = {
            description: 'Set the LED brightness.',
            args: [
                {
                    name: 'percent',
                    alias: 'p',
                    type: Number,
                    defaultOption: true,
                    description: 'Percent of the brightness'
                }
            ]
        };

        const { operations, parsedArgs, usage } = Uhk(cliOption);

        if (!parsedArgs.percent) {
            console.log(usage);
            process.exit(-1);
        }

        await operations.setLedPwmBrightness(parsedArgs.percent);

    } catch (error) {
        errorHandler(error);
    }
})();
