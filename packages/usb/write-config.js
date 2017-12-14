#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const uhk = require('./uhk');
const device = uhk.getUhkDevice();
require('shelljs/global');

program
    .usage(`config.bin`)
    .option('-h, --hardware-config', 'Write the hardware config instead of the user config')
    .parse(process.argv);

if (program.args.length == 0) {
    console.error('No binary config file specified.');
    exit(1);
}

const configBin = program.args[0];
const chunkSize = 60;
const isHardwareConfig = program.hardwareConfig;
const configTypeString = isHardwareConfig ? 'hardware' : 'user';
let configSize;
let offset = 0;
let configBuffer = fs.readFileSync(configBin);
let chunkSizeToRead;

const payload = new Buffer([
    uhk.usbCommands.getProperty,
    isHardwareConfig
        ? uhk.systemPropertyIds.hardwareConfigSize
        : uhk.systemPropertyIds.userConfigSize
    ]);

device.write(uhk.getTransferData(payload));
let buffer = Buffer.from(device.readSync());
configSize = Math.min(buffer[1] + (buffer[2]<<8), configBuffer.length);

while (offset < configSize) {
    const usbCommand = isHardwareConfig ? uhk.usbCommands.writeHardwareConfig : uhk.usbCommands.writeStagingUserConfig;
    chunkSizeToRead = Math.min(chunkSize, configSize - offset);

    if (chunkSizeToRead === 0) {
        break;
    }

    buffer = Buffer.concat([
        new Buffer([usbCommand, chunkSizeToRead, offset & 0xff, offset >> 8]),
        configBuffer.slice(offset, offset+chunkSizeToRead)
    ]);

    device.write(uhk.getTransferData(buffer));
    device.readSync();
    offset += chunkSizeToRead;
}
