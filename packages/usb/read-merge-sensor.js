#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function readMergeSensor() {
    const payload = new Buffer([uhk.usbCommands.readMergeSensor]);
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const receivedBuffer = device.readSync();
    console.log('Received', uhk.bufferToString(receivedBuffer));
    const areHalvesMerged = receivedBuffer[1] === 1;
    console.log('The keyboards halves are ' + (areHalvesMerged ? 'merged' : 'split'))

    setTimeout(readMergeSensor, 500)
}

readMergeSensor();
