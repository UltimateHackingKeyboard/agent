#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

(async () => {
    try {
        const argv = yargs
            .scriptName('./write-hardware-config.ts')
            .usage('Usage: $0 {iso|ansi}')
            .demandCommand(1, 'Layout is required.')
            .argv;

        const layout = argv._[0];

        if (!['ansi', 'iso'].includes(layout)) {
            console.log('Invalid layout. Layout should be either iso or ansi');
            process.exit(1);
        }
        const { operations } = Uhk(argv);
        await operations.saveHardwareConfiguration(layout === 'iso');

    } catch (error) {
        errorHandler(error);
    }
})();
