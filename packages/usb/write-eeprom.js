#!/usr/bin/env node
let uhk = require('./uhk');

let programName = process.argv[1];
let arg = process.argv[2] || '';

if (arg.length === 0) {
    console.log(`Usage: ${programName} [string to be written to the EEPROM]`);
    process.exit(1);
}

uhk.sendUsbPacket(Buffer.concat([new Buffer([uhk.usbCommands.writeEeprom, arg.length+2, 0x00, 0x00]), new Buffer(arg, 'utf8')]))
