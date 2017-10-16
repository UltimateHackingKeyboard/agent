#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
let transfer = new Buffer([uhk.usbCommands.jumpToSlaveBootloader, 0]);
console.log(transfer);
device.write(uhk.getTransferData(transfer));
const response = Buffer.from(device.readSync());
console.log(response);
