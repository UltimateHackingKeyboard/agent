#!/usr/bin/env node

const uhk = require('./uhk');
const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.setVariable, +process.argv[2], +process.argv[3]]);

console.log(sendData);
device.write(uhk.getTransferData(sendData));


