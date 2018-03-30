#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = Buffer.concat([new Buffer([uhk.usbCommands.switchKeymap, 3]), new Buffer('TES')]);
console.log(sendData)
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());
console.log(response);
