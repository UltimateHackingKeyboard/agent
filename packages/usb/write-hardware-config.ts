#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, getDeviceIdFromArg, yargs } from './src/index.js';

(async () => {
    try {
        const argv = yargs
            .scriptName('./write-hardware-config.ts')
            .usage('Usage: $0 {uhk60v1|uhk60v2|uhk80} {iso|ansi}')
            .demandCommand(2, 'DeviceId and layout is required.')
            .option('set-serial-number', {
                description: 'Use the given serial number instead of randomly generated one.',
                type: 'number',
            })
            .argv;

        const deviceId = getDeviceIdFromArg(argv._[0] as string);
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
