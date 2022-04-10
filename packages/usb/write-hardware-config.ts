#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import Uhk, { errorHandler, getDeviceIdFromArg, yargs } from './src/index.js';

(async () => {
    try {
        const argv = yargs
            .scriptName('./write-hardware-config.ts')
            .usage('Usage: $0 {uhk60v1|uhk60v2} {iso|ansi}')
            .demandCommand(2, 'DeviceId and layout is required.')
            .argv;

        const deviceId = getDeviceIdFromArg(argv._[0] as string);
        const layout = argv._[1] as string;

        if (!['ansi', 'iso'].includes(layout)) {
            console.log('Invalid layout. Layout should be either iso or ansi');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.saveHardwareConfiguration(layout === 'iso', deviceId);

    } catch (error) {
        errorHandler(error);
    }
})();
