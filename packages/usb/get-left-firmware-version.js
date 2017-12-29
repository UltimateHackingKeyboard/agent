#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.getModuleProperty, uhk.modulePropertyIds.protocolVersions]);
console.log(sendData)
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());
console.log(response)
const firmwareMajorVersion = response[7] + (response[8]<<8);
const firmwareMinorVersion = response[9] + (response[10]<<8);
const firmwarePatchVersion = response[11] + (response[12]<<8);

console.log(`firmwareMajorVersion: ${firmwareMajorVersion}`);
console.log(`firmwareMinorVersion: ${firmwareMinorVersion}`);
console.log(`firmwarePatchVersion: ${firmwarePatchVersion}`);
