#!/usr/bin/env node
let uhk = require('./uhk');

let programName = process.argv[1];
let brightnessPercent = process.argv[2] || '';

if (brightnessPercent.length === 0) {
    console.log('Usage: ${programName} [LED pwm percent]');
    process.exit(1);
}

uhk.sendUsbPackets([
    new Buffer([uhk.usbCommands.setLedPwm, +brightnessPercent])
]);
