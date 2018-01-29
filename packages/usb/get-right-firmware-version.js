#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.protocolVersions]);
//console.log(sendData)
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());
//console.log(response)
const firmwareMajorVersion = uhk.getUint16(response, 1);
const firmwareMinorVersion = uhk.getUint16(response, 3);
const firmwarePatchVersion = uhk.getUint16(response, 5);

console.log(`firmwareVersion: ${firmwareMajorVersion}.${firmwareMinorVersion}.${firmwarePatchVersion}`);
