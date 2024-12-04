#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

(async function () {
    try {
        const argv = yargs
            .scriptName('./exec-macro-command.ts')
            .usage(`Usage: $0 <macro command>`)
            .demandCommand(1, 'Command required')
            .argv;

        const cmd = argv._[0];

        if (cmd.length > 63) {
            console.error('Command is too long. At most 63 characters are supported. Feel free to execute native uhk macro using `exec <uhk macro name>`.');
            process.exit(1);
        }

        const { operations } = Uhk(argv);
        await operations.execMacroCommand(cmd);
    } catch (error) {
        await errorHandler(error);
    }
})();
