#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import {
    UhkHidDevice,
    UhkOperations,
    UsbVariables,
} from 'uhk-usb';

import Uhk, { errorHandler, getHidDevicesFromDeviceArg, yargs } from './src/index.js';

try {
    const keys = Object.keys(UsbVariables)
        .filter((key: any) => isNaN(key))
        .join(', ');

    const argv = yargs
        .scriptName('./set-variable.ts')
        .usage('Usage: $0 <variable> <value>')
        .demandCommand(2, `Variable is required. Specify one of: ${keys}`)
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

    if (argv.device) {
        const hidDevices = await getHidDevicesFromDeviceArg(argv.device);
        const { logger, rootDir } = Uhk(argv);

        for (const hidDevice of hidDevices) {
            const uhkHidDevice = new UhkHidDevice(logger, argv, rootDir, hidDevice);
            const uhkOperations = new UhkOperations(logger, uhkHidDevice);
            await uhkOperations.setVariable(UsbVariables[variable], value);
        }
    }
    else {
        const { operations } = Uhk(argv);

        await operations.setVariable(UsbVariables[variable], value);
    }
} catch (error) {
    await errorHandler(error);
}
