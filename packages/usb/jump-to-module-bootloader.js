#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');

program
    .usage(`moduleSlot`)
    .parse(process.argv)

const moduleSlot = program.args[0];
const moduleSlotId = uhk.checkModuleSlot(moduleSlot, uhk.moduleSlotToId);
const device = uhk.getUhkDevice();

(async function() {
    await uhk.jumpToModuleBootloader(device, moduleSlotId);
})();
