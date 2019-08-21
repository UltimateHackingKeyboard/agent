#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = Buffer.from([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.configSizes]);
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());

const hardwareConfigMaxSize = response[1] + (response[2]<<8);
const userConfigMaxSize = response[3] + (response[4]<<8);

console.log(`hardwareConfigMaxSize: ${hardwareConfigMaxSize}`);
console.log(`userConfigMaxSize: ${userConfigMaxSize}`);
