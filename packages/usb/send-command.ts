#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, getI2cAddressFromArg, yargs } from './src/index.js';

const argv = yargs
    .scriptName('./send-command.ts')
    .usage('Send USB command to the keyboard')
    .argv;

const { device } = Uhk(argv);

await device.write(argv._.map(arg => parseInt(arg, 16))
