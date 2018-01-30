#!/usr/bin/env node
const path = require('path');
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

let buffer = new Buffer([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.i2cBaudRate]);
//console.log(buffer);
device.write(uhk.getTransferData(buffer));
let response = device.readSync();
//console.log(Buffer.from(response));
let requestedBaudRate = uhk.getUint32(response, 2);
let actualBaudRate = uhk.getUint32(response, 6);
console.log(`requestedBaudRate:${requestedBaudRate} | actualBaudRate:${actualBaudRate} | I2C0_F:0b${response[1].toString(2).padStart(8, '0')}`)
