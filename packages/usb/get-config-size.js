#!/usr/bin/env node
let uhk = require('./uhk');
let process = require('process');

uhk.silent = true;
let isHardwareConfig = process.argv[2] === 'h';
let configTypeString = isHardwareConfig ? 'hardware' : 'user';

uhk.sendUsbPacketsByCallback(() => {
    return new Buffer([uhk.usbCommands.getProperty, isHardwareConfig ? uhk.systemPropertyIds.hardwareConfigSize : uhk.systemPropertyIds.userConfigSize]);
});

uhk.registerReceiveCallback((buffer) => {
    configSize = buffer[1] + (buffer[2]<<8);
    console.log(configSize);
    process.exit(0);
});
