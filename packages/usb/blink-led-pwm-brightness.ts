#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .usage('Blink led pwm brightness')
    .argv;

const { operations } = Uhk(argv);

let areLedsEnabled = true;

setInterval(async function () {
    try {
        areLedsEnabled = !areLedsEnabled;
        const brightnessPercent = areLedsEnabled ? 100 : 0;
        await operations.setLedPwmBrightness(brightnessPercent);
    } catch (error) {
        await errorHandler(error);
    }
}, 500);
