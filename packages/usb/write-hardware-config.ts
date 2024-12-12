#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import {
    ALL_UHK_DEVICES,
} from 'uhk-common';

import Uhk, { errorHandler, getUhkDeviceProductFromArg, getDevicesOptions, yargs } from './src/index.js';

const devicesOptions = getDevicesOptions(ALL_UHK_DEVICES);

(async () => {
    try {
        const argv = yargs
            .scriptName('./write-hardware-config.ts')
            .usage(`Usage: $0 {${devicesOptions}} {iso|ansi}`)
            .demandCommand(2, 'DeviceId and layout is required.')
            .option('set-serial-number', {
                description: 'Use the given serial number instead of randomly generated one.',
                type: 'number',
            })
            .argv;

        const deviceId = getUhkDeviceProductFromArg(ALL_UHK_DEVICES, argv._[0] as string).id;
        const layout = argv._[1] as string;

        if (!['ansi', 'iso'].includes(layout)) {
            console.log('Invalid layout. Layout should be either iso or ansi');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.saveHardwareConfiguration(layout === 'iso', deviceId, argv.setSerialNumber);

    } catch (error) {
        await errorHandler(error);
    }
})();
