#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
const sendData = Buffer.from([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.protocolVersions]);
//console.log(sendData)
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());
//console.log(response)
const firmwareMajorVersion = uhk.getUint16(response, 1);
const firmwareMinorVersion = uhk.getUint16(response, 3);
const firmwarePatchVersion = uhk.getUint16(response, 5);

const deviceProtocolMajorVersion = uhk.getUint16(response, 7);
const deviceProtocolMinorVersion = uhk.getUint16(response, 9);
const deviceProtocolPatchVersion = uhk.getUint16(response, 11);

const moduleProtocolMajorVersion = uhk.getUint16(response, 13);
const moduleProtocolMinorVersion = uhk.getUint16(response, 15);
const moduleProtocolPatchVersion = uhk.getUint16(response, 17);

const userConfigMajorVersion = uhk.getUint16(response, 19);
const userConfigMinorVersion = uhk.getUint16(response, 21);
const userConfigPatchVersion = uhk.getUint16(response, 23);

const hardwareConfigMajorVersion = uhk.getUint16(response, 25);
const hardwareConfigMinorVersion = uhk.getUint16(response, 27);
const hardwareConfigPatchVersion = uhk.getUint16(response, 29);

console.log(`firmwareVersion: ${firmwareMajorVersion}.${firmwareMinorVersion}.${firmwarePatchVersion}`);
console.log(`deviceProtocolVersion: ${deviceProtocolMajorVersion}.${deviceProtocolMinorVersion}.${deviceProtocolPatchVersion}`);
console.log(`moduleProtocolVersion: ${moduleProtocolMajorVersion}.${moduleProtocolMinorVersion}.${moduleProtocolPatchVersion}`);
console.log(`userConfigVersion: ${userConfigMajorVersion}.${userConfigMinorVersion}.${userConfigPatchVersion}`);
console.log(`hardwareConfigVersion: ${hardwareConfigMajorVersion}.${hardwareConfigMinorVersion}.${hardwareConfigPatchVersion}`);
