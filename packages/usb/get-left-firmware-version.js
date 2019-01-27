#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = new Buffer([
    uhk.usbCommands.getModuleProperty,
    uhk.moduleSlotToId.leftHalf,
    uhk.modulePropertyIds.protocolVersions,
]);
//console.log(sendData)
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());
//console.log(response)
const moduleProtocolMajorVersion = uhk.getUint16(response, 2);
const moduleProtocolMinorVersion = uhk.getUint16(response, 4);
const moduleProtocolPatchVersion = uhk.getUint16(response, 6);
const firmwareMajorVersion = uhk.getUint16(response, 8);
const firmwareMinorVersion = uhk.getUint16(response, 10);
const firmwarePatchVersion = uhk.getUint16(response, 12);

console.log(
    `moduleProtocolVersion: ${moduleProtocolMajorVersion}.${moduleProtocolMinorVersion}.${moduleProtocolPatchVersion}`,
);
console.log(`firmwareVersion: ${firmwareMajorVersion}.${firmwareMinorVersion}.${firmwarePatchVersion}`);
