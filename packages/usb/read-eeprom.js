#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();
device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.readEeprom, 63, 0x00, 0x00])));
