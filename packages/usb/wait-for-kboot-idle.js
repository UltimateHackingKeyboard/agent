#!/usr/bin/env node
const uhk = require('./uhk');

function getCurrentKbootCommand() {
    device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.currentKbootCommand])));
    const response = Buffer.from(device.readSync());
    const currentKbootCommand = response[1];
    if (currentKbootCommand == 0) {
        console.log('Bootloader pinged.');
        process.exit(0);
    } else {
        console.log("Cannot ping the bootloader. Please reconnect the left keyboard half. It probably needs several tries, so keep reconnecting until you see this message.");
    }
}

const device = uhk.getUhkDevice();

getCurrentKbootCommand();

setInterval(() => {
    getCurrentKbootCommand();
}, 500);
