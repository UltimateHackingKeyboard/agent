#!/usr/bin/env node
const fs = require('fs');
const uhk = require('./uhk');
const device = uhk.getUhkDevice();
const chunkSize = 63;

let isHardwareConfig = process.argv[2] === 'h';
let configTypeString = isHardwareConfig ? 'hardware' : 'user';
let configSize;
let offset = 0;
let configBuffer = new Buffer(0);
let chunkSizeToRead;

const payload = new Buffer([
    uhk.usbCommands.getProperty,
    isHardwareConfig
        ? uhk.systemPropertyIds.hardwareConfigSize
        : uhk.systemPropertyIds.userConfigSize
    ]);

device.write(uhk.getTransferData(payload));

let buffer = Buffer.from(device.readSync());
configSize = buffer[1] + (buffer[2]<<8);
console.log(`${configTypeString}configSize:`, configSize);
while (offset < configSize) {
    const configBufferId = isHardwareConfig ? uhk.configBufferIds.hardwareConfig : uhk.configBufferIds.validatedUserConfig;
    chunkSizeToRead = Math.min(chunkSize, configSize - offset);
    buffer = Buffer.from([uhk.usbCommands.readConfig, configBufferId, chunkSizeToRead, offset & 0xff, offset >> 8]);
    console.log('write to keyboard', uhk.bufferToString(buffer));
    device.write(uhk.getTransferData(buffer));
    buffer = Buffer.from(device.readSync());
    console.log('read-config-chunk', uhk.bufferToString(buffer));
    configBuffer = Buffer.concat([configBuffer, new Buffer(buffer.slice(1, chunkSizeToRead + 1))]);
    offset += chunkSizeToRead
}
console.log('read ', uhk.bufferToString(configBuffer));
fs.writeFileSync(`${configTypeString}-config.read`, configBuffer);
