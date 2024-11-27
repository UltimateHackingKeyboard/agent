#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .usage('Periodically query the UHK state')
    .argv;

const { device } = Uhk(argv);

setInterval(async function () {
    try {
        const state = await device.getDeviceState();
        console.log(
            `isEepromBusy: ${state.isEepromBusy ? 'yes' : 'no'} | \
isMacroStatusDirty: ${state.isMacroStatusDirty ? 'yes' : 'no'} | \
areHalvesMerged: ${state.areHalvesMerged ? 'yes' : 'no'} | \
newPairedDevice: ${state.newPairedDevice ? 'yes' : 'no'} | \
leftKeyboardHalfSlot:${state.leftKeyboardHalfSlot} | \
leftModuleSlot:${state.leftModuleSlot} | \
rightModuleSlot:${state.rightModuleSlot} | \
layer:${state.activeLayerName} ${state.activeLayerToggled ? 'toggled' : ''}`
        );
    } catch (error) {
        await errorHandler(error);
    }
}, 500);
