#!/usr/bin/env node
const uhk = require('./uhk');

const programName = process.argv[1];
const arg = process.argv[2] || '';

if (arg.length === 0) {
    console.log(`Usage: ${programName} [string to be written to the EEPROM]`);
    process.exit(1);
}

const device = uhk.getUhkDevice();
const buffer = Buffer.concat([
    new Buffer([uhk.usbCommands.writeEeprom, arg.length+2, 0x00, 0x00]),
    new Buffer(arg, 'utf8')]);
device.write(uhk.getTransferData(buffer));
