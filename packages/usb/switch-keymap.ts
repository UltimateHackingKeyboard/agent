#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

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
