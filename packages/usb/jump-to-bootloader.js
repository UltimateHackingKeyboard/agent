#!/usr/bin/env node
let uhk = require('./uhk');

let timeoutMs = 10000;
let pollingIntervalMs = 100;
let bootloaderTimeoutMs = 5000;
let jumped = false;

console.log('Trying to jump to the bootloader...');
setInterval(() => {
    timeoutMs -= pollingIntervalMs;

    let device = uhk.getBootloaderDevice();

    if (device) {
        console.log('Bootloader is up');
        process.exit(0);
    }

    if (timeoutMs <= 0) {
        console.log("Couldn't jump to the bootloader");
        process.exit(1);
    }

    device = uhk.getUhkDevice();
    if (device && !jumped) {
        console.log('UHK found, jumping to bootloader');
        let t =  bootloaderTimeoutMs;
        device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.jumpToBootloader, 0, t&0xff, (t&0xff<<8)>>8, (t&0xff<<16)>>16, (t&0xff<<24)>>24])));
        jumped = true;
    }

}, pollingIntervalMs);
