#!/usr/bin/env node
const uhk = require('./uhk');

const eepromTransferType = process.argv[2];
const eepromTransfer = uhk.eepromTransfer[eepromTransferType];

if (eepromTransfer === undefined) {
    console.error(`Gotta provide one of ${Object.keys(uhk.eepromTransfer).join(', ')}`);
    process.exit(1);
}

const device = uhk.getUhkDevice();
device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.launchEepromTransfer, eepromTransfer.operation, eepromTransfer.configBuffer])));
const buffer = Buffer.from(device.readSync());
const responseCode = buffer[0];
if (responseCode !== 0) {
    console.error(`Write user config to eeprom failed. Response code: ${responseCode}`);
    process.exit(1);
}

function waitUntilKeyboardBusy() {

    device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.getKeyboardState])));
    const keyboardStateBuffer = Buffer.from(device.readSync());

    if (keyboardStateBuffer[1] === 1) {
        setTimeout(waitUntilKeyboardBusy, 200);
    }
}

waitUntilKeyboardBusy();
