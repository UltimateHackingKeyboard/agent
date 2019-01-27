#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');
require('shelljs/global');

const extension = '.bin';
config.fatal = true;

program.usage(`moduleSlot firmwareImage${extension}`).parse(process.argv);

let moduleSlot = program.args[0];
const moduleSlotId = uhk.checkModuleSlot(moduleSlot, uhk.moduleSlotToId);
const i2cAddress = uhk.checkModuleSlot(moduleSlot, uhk.moduleSlotToI2cAddress);

const firmwareImage = program.args[1];
uhk.checkFirmwareImage(firmwareImage, extension);

(async function() {
    await uhk.updateModuleFirmware(i2cAddress, moduleSlotId, firmwareImage);
})();
