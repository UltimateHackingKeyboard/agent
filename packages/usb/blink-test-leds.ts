#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .usage('Blink test leds')
    .argv;

const { operations } = Uhk(argv);
let areLedsEnabled = true;

setInterval(async function () {
    try {
        areLedsEnabled = !areLedsEnabled;

        await operations.setTestLedsState(areLedsEnabled);
    } catch (error) {
        errorHandler(error);
    }
}, 500);
