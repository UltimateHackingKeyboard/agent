#!/usr/bin/env node
const uhk = require('./uhk');

uhk.silent = true;
const isHardwareConfig = process.argv[2] === 'h';

const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.getProperty,
    isHardwareConfig ?
        uhk.systemPropertyIds.hardwareConfigSize
        : uhk.systemPropertyIds.userConfigSize]);

device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());
console.log(response[1] + (response[2]<<8));
