#!/usr/bin/env ts-node-script

import Uhk, { errorHandler, yargs } from './src';

const argv = yargs
    .usage('Periodically query the UHK state')
    .argv;

const { device } = Uhk(argv);

setInterval(async function () {
    try {
        const state = await device.getDeviceState();
        console.log(
            `isEepromBusy: ${state.isEepromBusy ? 'yes' : 'no'} | \
areHalvesMerged: ${state.areHalvesMerged ? 'yes' : 'no'} | \
leftKeyboardHalfSlot:${state.leftKeyboardHalfSlot} | \
leftModuleSlot:${state.leftModuleSlot} | \
rightModuleSlot:${state.rightModuleSlot} | \
layer:${state.activeLayerName} ${state.activeLayerToggled ? 'toggled' : ''}`
        );
    } catch (error) {
        errorHandler(error);
    }
}, 500);
