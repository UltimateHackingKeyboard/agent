#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import { UsbVariables } from 'uhk-usb';

(async () => {
    try {
        const keys = Object.keys(UsbVariables)
            .filter((key: any) => isNaN(key))
            .join(', ');

        const argv = yargs
            .scriptName('./set-variable.ts')
            .usage('Usage: $0 <variable> <value>')
            .demandCommand(1, `Variable is required. Specify one of: ${keys}`)
            .argv as any;

        const variable = argv._[0] as string;

        if (!Object.values(UsbVariables).includes(variable)) {
            console.error(`The specified variable does not exist. Specify one of: ${keys}`);
            process.exit(1);
        }

        const value = parseInt(argv._[1]);

        if (isNaN(value)) {
            console.error(`Value must be a number.`);
            process.exit(1);
        }

        const { operations } = Uhk(argv);

        await operations.setVariable(UsbVariables[variable], value);

    } catch (error) {
        errorHandler(error);
    }
})();
