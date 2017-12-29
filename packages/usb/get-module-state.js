#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function getModuleState() {
    const payload = new Buffer([uhk.usbCommands.getModuleProperty, 1]);
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const receivedBuffer = device.readSync();
    console.log('Received', uhk.bufferToString(receivedBuffer));
    setTimeout(getModuleState, 500)
}

getModuleState();
