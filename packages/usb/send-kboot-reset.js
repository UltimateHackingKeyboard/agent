#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
let transfer = new Buffer([uhk.usbCommands.sendKbootCommand, 0x10]);
device.write(uhk.getTransferData(transfer));
const response = Buffer.from(device.readSync());
