#!/usr/bin/env node
const uhk = require('./uhk');
const path = require('path');

function printUsage() {
    const scriptFilename = path.basename(process.argv[1]);
    const commands = Object.keys(uhk.kbootCommands).join(' | ');
    console.log(
`Usage: ${scriptFilename} command i2cAddress
command: ${commands}
i2cAddress is not needed for the idle command`);
}

const kbootCommand = process.argv[2];
if (!kbootCommand) {
    console.log(`No command provided`);
    process.exit(1);
}

const kbootCommandId = uhk.kbootCommands[kbootCommand];
if (!kbootCommandId) {
    console.log(`Invalid command provided`);
    process.exit(1);
}

const i2cAddress = process.argv[3];
if (kbootCommand !== 'idle' && !i2cAddress) {
    console.log(`No i2cAddress provided`);
    process.exit(1);
}

const device = uhk.getUhkDevice();
let transfer = new Buffer([uhk.usbCommands.sendKbootCommand, kbootCommandId, parseInt(i2cAddress)]);
device.write(uhk.getTransferData(transfer));
const response = Buffer.from(device.readSync());
