#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.protocolVersions]);
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());

const firmwareMajorVersion = response[1] + (response[2]<<8);
const firmwareMinorVersion = response[3] + (response[4]<<8);
const firmwarePatchVersion = response[5] + (response[6]<<8);

console.log(`firmwareMajorVersion: ${firmwareMajorVersion}`);
console.log(`firmwareMinorVersion: ${firmwareMinorVersion}`);
console.log(`firmwarePatchVersion: ${firmwarePatchVersion}`);
