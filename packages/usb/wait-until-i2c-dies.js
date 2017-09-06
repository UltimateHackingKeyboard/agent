#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();
let lastWatchdogCounter = -1;

function monitorI2c() {
    const payload = new Buffer([uhk.usbCommands.readDebugInfo]);
//    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    device.write([64]);
    const receivedBuffer = Buffer.from(device.readSync());
    const watchdogCounter = (receivedBuffer[1] << 0) + (receivedBuffer[2] << 8) + (receivedBuffer[3] << 16) + (receivedBuffer[4] << 24);
    if (watchdogCounter === lastWatchdogCounter) {
        process.exit(0);
    }
    setTimeout(monitorI2c, 100)
}

monitorI2c();
