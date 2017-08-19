#!/usr/bin/env node
let fs = require('fs');
let uhk = require('./uhk');

let eepromTransferType = process.argv[2];
let eepromTransferId = uhk.eepromTransfer[eepromTransferType];

if (eepromTransferId === undefined) {
    console.error(`Gotta provide one of ${Object.keys(uhk.eepromTransfer).join(', ')}`);
    process.exit(1);
}

let isFirstSend = true;
let isFirstReceive = true;
let isEepromBusy = true;

uhk.sendUsbPacketsByCallback(() => {
    if (isFirstSend) {
        isFirstSend = false;
        return new Buffer([uhk.usbCommands.launchEepromTransfer, eepromTransferId]);
    } else {
        return isEepromBusy ? new Buffer([uhk.usbCommands.getKeyboardState]) : null;
    }
});

uhk.registerReceiveCallback((buffer) => {
    if (isFirstReceive) {
        isFirstReceive = false;
    } else {
        isEepromBusy = buffer[1] === 1;
    }
});
