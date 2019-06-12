#!/usr/bin/env node
const fs = require('fs');
const uhk = require('./uhk');
const device = uhk.getUhkDevice();
const chunkSize = 63;

let isHardwareConfig = process.argv[2] === 'h';
let configTypeString = isHardwareConfig ? 'hardware' : 'user';
let offset = 0;
let configBuffer = Buffer.alloc(0);
let chunkSizeToRead;

const payload = Buffer.from([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.configSizes]);
device.write(uhk.getTransferData(payload));
let buffer = Buffer.from(device.readSync());
const hardwareConfigMaxSize = buffer[1] + (buffer[2]<<8);
const userConfigMaxSize = buffer[3] + (buffer[4]<<8);
const configMaxSize = isHardwareConfig ? hardwareConfigMaxSize : userConfigMaxSize;
const configSize = Math.min(configMaxSize, configBuffer.length);

console.log(`${configTypeString}configSize:`, configSize);
while (offset < configSize) {
    const configBufferId = isHardwareConfig ? uhk.configBufferIds.hardwareConfig : uhk.configBufferIds.validatedUserConfig;
    chunkSizeToRead = Math.min(chunkSize, configSize - offset);
    buffer = Buffer.from([uhk.usbCommands.readConfig, configBufferId, chunkSizeToRead, offset & 0xff, offset >> 8]);
    console.log('write to keyboard', uhk.bufferToString(buffer));
    device.write(uhk.getTransferData(buffer));
    buffer = Buffer.from(device.readSync());
    console.log('read-config-chunk', uhk.bufferToString(buffer));
    configBuffer = Buffer.concat([configBuffer, Buffer.from(buffer.slice(1, chunkSizeToRead + 1))]);
    offset += chunkSizeToRead
}
console.log('read ', uhk.bufferToString(configBuffer));
fs.writeFileSync(`${configTypeString}-config.read`, configBuffer);
