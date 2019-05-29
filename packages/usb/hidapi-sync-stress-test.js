#!/usr/bin/env node
const uhk = require('./uhk');

const device = uhk.getUhkDevice();
let counter = 1;

while (true) {
    console.log(`hidapi sync test ${counter++}`);
    const sendData = Buffer.from([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.configSizes]);
    device.write(uhk.getTransferData(sendData));
    device.readSync()
}
