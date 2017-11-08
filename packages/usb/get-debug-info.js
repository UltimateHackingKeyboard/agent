#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function getDebugInfo() {
    const payload = new Buffer([uhk.usbCommands.readDebugInfo]);
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const receivedBuffer = Buffer.from(device.readSync());
    console.log('Received', uhk.bufferToString(receivedBuffer));
    setTimeout(getDebugInfo, 500);
}

getDebugInfo();
