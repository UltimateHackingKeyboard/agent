#!/usr/bin/env node
let fs = require('fs');
let uhk = require('./uhk');

const chunkSize = 63;

let isHardwareConfig = process.argv[2] === 'h';
let configTypeString = isHardwareConfig ? 'hardware' : 'user';
let isFirstSend = true;
let isFirstReceive = true;
let configSize;
let offset = 0;
let configBuffer = new Buffer(0);
let chunkSizeToRead;

uhk.sendUsbPacketsByCallback(() => {
    if (isFirstSend) {
        isFirstSend = false;
        return new Buffer([uhk.usbCommands.getProperty, isHardwareConfig ? uhk.systemPropertyIds.hardwareConfigSize : uhk.systemPropertyIds.userConfigSize]);
    } else {
        chunkSizeToRead = Math.min(chunkSize, configSize - offset)
        let usbCommand = isHardwareConfig ? uhk.usbCommands.readHardwareConfig : uhk.usbCommands.readUserConfig;
        let buffer = Buffer([usbCommand, chunkSizeToRead, offset & 0xff, offset >> 8]);
        let bufferOrNull = offset >= configSize ? null : buffer;
        if (!bufferOrNull) {
            fs.writeFileSync(`${configTypeString}-config.read`, configBuffer);
        }
        offset += chunkSizeToRead;
        return bufferOrNull;
    }
});

uhk.registerReceiveCallback((buffer) => {
    if (isFirstReceive) {
        isFirstReceive = false;
        configSize = buffer[1] + (buffer[2]<<8);
        console.log(`${configTypeString}configSize:`, configSize);
    } else {
        configBuffer = Buffer.concat([configBuffer, new Buffer(buffer.slice(1, chunkSizeToRead+1))]);
    }
});
