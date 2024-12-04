#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

(async () => {
    try {
        const argv = yargs
            .scriptName('./switch-keymap.ts')
            .usage('Usage: $0')
            .argv as any;

        const { operations } = Uhk(argv);
        await operations.waitForKbootIdle();

    } catch (error) {
        await errorHandler(error);
    }
})();
