#!/usr/bin/env node
let uhk = require('./uhk');

let programName = process.argv[1];

if (process.argv.length !== 3) {
    console.log(`Usage: ${programName} [LED pwm 0-100]`);
    process.exit(1);
}

let leftBrightnessPercent = process.argv[2] || '';

uhk.sendUsbPackets([
    new Buffer([uhk.usbCommands.setLedPwm, +leftBrightnessPercent]),
]);
