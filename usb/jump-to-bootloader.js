#!/usr/bin/env node
let uhk = require('./uhk');

let timeoutMs = 10000;
let pollingIntervalMs = 100;

console.log('Trying to jump to the bootloader...');
setInterval(() => {
    timeoutMs -= pollingIntervalMs;

    if (uhk.getBootloaderDevice()) {
        console.log('Bootloader is up');
        process.exit(0);
    }

    if (timeoutMs <= 0) {
        console.log("Couldn't jump to the bootloader");
        process.exit(1);
    }

    if (uhk.getUhkDevice()) {
        console.log('UHK found, jumping to bootloader');
        uhk.sendUsbPacket(new Buffer([uhk.usbCommands.jumpToBootloader]));
    }

}, pollingIntervalMs);
