#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

import Uhk, { errorHandler, yargs } from './src/index.js';

(async () => {
    try {
        const argv = yargs
            .scriptName('./switch-keymap.ts')
            .usage('Usage: $0 <keymap abbreviation>')
            .demandCommand(1, 'Keymap abbreviation is required')
            .argv as any;

        const { operations } = Uhk(argv);
        await operations.switchKeymap(argv._[0]);

    } catch (error) {
        errorHandler(error);
    }
})();
