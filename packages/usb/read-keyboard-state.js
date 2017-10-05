#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function readKeyboardState() {
    const payload = new Buffer([uhk.usbCommands.getKeyboardState]);
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const receivedBuffer = device.readSync();
    console.log('Received', uhk.bufferToString(receivedBuffer));
    setTimeout(readKeyboardState, 500)
}

readKeyboardState();
