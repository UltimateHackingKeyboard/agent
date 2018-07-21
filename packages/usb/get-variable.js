#!/usr/bin/env node

const uhk = require('./uhk');
const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.getVariable, +process.argv[2]]);

console.log(sendData);
device.write(uhk.getTransferData(sendData));
const receivedBuffer = Buffer.from(device.readSync());
console.log(receivedBuffer[1]);

