#!/usr/bin/env node
let uhk = require('./uhk');

let programName = process.argv[1];

if (process.argv.length !== 4) {
    console.log(`Usage: ${programName} [left LED pwm 0-100] [right LED pwm 0-100]`);
    process.exit(1);
}

let leftBrightnessPercent = process.argv[2] || '';
let rightBrightnessPercent = process.argv[3] || '';

uhk.sendUsbPackets([
    new Buffer([uhk.usbCommands.setLedPwm, 0, +leftBrightnessPercent]),
    new Buffer([uhk.usbCommands.setLedPwm, 1, +rightBrightnessPercent]),
]);
