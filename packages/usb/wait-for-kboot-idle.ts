#!/usr/bin/env ../../node_modules/.bin/ts-node-esm

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
        errorHandler(error);
    }
})();
