#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';
import { Buffer } from 'uhk-common';

const argv = yargs
    .scriptName('./send-command.ts')
    .usage('Send USB command to the keyboard')
    .argv;

try {
    if (argv._.length === 0) {
        console.error('No command arguments specified');
        process.exit(1);
    }

    const { device } = Uhk(argv);

    const buffer = Buffer.from(argv._.map(arg => parseInt(arg, 10)));

    const response = await device.write(buffer);

    process.stdout.write('Byte result:\n');
    for(const byte of response) {
        process.stdout.write(byte.toString(10));
        process.stdout.write(' ');
    }

    process.stdout.write('\n');
    process.stdout.write('\n');
    process.stdout.write('String result:\n');
    process.stdout.write(response.toString('utf8', 1));
    process.stdout.write('\n');
} catch (error) {
    errorHandler(error);
}
