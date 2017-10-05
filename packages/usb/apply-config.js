#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.applyConfig]);
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());
console.log(response);
