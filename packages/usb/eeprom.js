#!/usr/bin/env node
const uhk = require('./uhk');

const eepromTransferType = process.argv[2];
const eepromTransfer = uhk.eepromTransfer[eepromTransferType];

if (eepromTransfer === undefined) {
    console.error(`Gotta provide one of ${Object.keys(uhk.eepromTransfer).join(', ')}`);
    process.exit(1);
}

//    const buffer = await uhk.writeDevice(device, [uhk.usbCommands.launchEepromTransfer, eepromTransfer.operation, eepromTransfer.configBuffer]);

