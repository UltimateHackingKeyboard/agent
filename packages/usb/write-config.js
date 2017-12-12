#!/usr/bin/env node
const fs = require('fs');
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

const chunkSize = 60;

const isHardwareConfig = process.argv[2] === 'h';
const configTypeString = isHardwareConfig ? 'hardware' : 'user';
let configSize;
let offset = 0;
let configBuffer = fs.readFileSync(`${configTypeString}-config.write`);
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
    const usbCommand = isHardwareConfig ? uhk.usbCommands.writeHardwareConfig : uhk.usbCommands.writeStagingUserConfig;
    chunkSizeToRead = Math.min(chunkSize, configSize - offset);
    buffer = Buffer.concat([
        new Buffer([usbCommand, chunkSizeToRead, offset & 0xff, offset >> 8]),
        configBuffer.slice(offset, offset+chunkSizeToRead)
    ]);
    console.log('write-config-chunk:', uhk.bufferToString(buffer));
    device.write(uhk.getTransferData(buffer));
    device.readSync();
    offset += chunkSizeToRead;
}
