#!/usr/bin/env node
let uhk = require('./uhk');
var arg = process.argv[2] || '';

if (arg.length === 0) {
    console.log('Gotta specify a string to be written to the EEPROM as the argument of this script');
    process.exit(1);
}

uhk.sendUsbPacket(Buffer.concat([new Buffer([uhk.usbCommands.writeEeprom, arg.length+2, 0x00, 0x00]), new Buffer(arg, 'utf8')]))
