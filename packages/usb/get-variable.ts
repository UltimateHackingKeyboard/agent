#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';
import { UsbVariables } from 'uhk-usb';

(async function () {
    try {
        const argv = yargs
            .scriptName('./get-variable.ts')
            .usage('Usage: $0 <variable>')
            .demandCommand(1, 'Variable required')
            .argv;

        const variable = argv._[0];

        if (!Object.values(UsbVariables).includes(variable)) {
            const keys = Object.keys(UsbVariables)
                .filter((key: any) => isNaN(key))
                .join(', ');
            console.error(`The specified variable does not exist. Specify one of ${keys}`);
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        const value = await operations.getVariable(UsbVariables[variable]);

        console.log(value);
    } catch (error) {
        await errorHandler(error);
    }
})();
