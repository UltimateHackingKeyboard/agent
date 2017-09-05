#!/usr/bin/env node
const uhk = require('./uhk');

const eepromTransferType = process.argv[2];
const eepromTransferId = uhk.eepromTransfer[eepromTransferType];

if (eepromTransferId === undefined) {
    console.error(`Gotta provide one of ${Object.keys(uhk.eepromTransfer).join(', ')}`);
    process.exit(1);
}

const device = uhk.getUhkDevice();
device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.launchEepromTransfer, eepromTransferId])));
const buffer = Buffer.from(device.readSync());
if(buffer[1] === 1) {
    device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.getKeyboardState])));
}
