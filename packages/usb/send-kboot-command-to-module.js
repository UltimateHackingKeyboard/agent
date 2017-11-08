#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');
const path = require('path');

program
    .usage(`command [moduleSlot]

  command: ${Object.keys(uhk.kbootCommands).join(' | ')}
  moduleSlot: ${Object.keys(uhk.moduleSlotToI2cAddress).join(' | ')}
  moduleSlot is always required, except for the idle command.`)
    .parse(process.argv)

const kbootCommand = program.args[0];
if (!kbootCommand) {
    console.log(`No command provided.`);
    console.log(`Valid commands: ${Object.keys(uhk.kbootCommands).join(', ')}`);
    process.exit(1);
}

const kbootCommandId = uhk.kbootCommands[kbootCommand];
if (kbootCommandId === undefined) {
    console.log(`Invalid command "${kbootCommand}" provided.`);
    console.log(`Valid commands: ${Object.keys(uhk.kbootCommands).join(', ')}`);
    process.exit(1);
}

const moduleSlot = program.args[1];

let i2cAddress;
if (kbootCommand !== 'idle') {
    i2cAddress = uhk.checkModuleSlot(moduleSlot, uhk.moduleSlotToI2cAddress);
}

const device = uhk.getUhkDevice();
let transfer = new Buffer([uhk.usbCommands.sendKbootCommandToModule, kbootCommandId, parseInt(i2cAddress)]);
device.write(uhk.getTransferData(transfer));
const response = Buffer.from(device.readSync());
