#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();

function getAdcValue() {
    const data = uhk.getTransferData(new Buffer([uhk.usbCommands.getAdcValue]));
    console.log('Sending ', data);
    device.write(data);
    const receivedBuffer = Buffer.from(device.readSync());
    console.log('Received', uhk.bufferToString(receivedBuffer), (receivedBuffer[2]*255 + receivedBuffer[1])/4096*5.5*1.045);

    setTimeout(getAdcValue, 500)
}

getAdcValue();
