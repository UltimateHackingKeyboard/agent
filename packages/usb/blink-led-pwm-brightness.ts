#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

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
        errorHandler(error);
    }
}, 500);
