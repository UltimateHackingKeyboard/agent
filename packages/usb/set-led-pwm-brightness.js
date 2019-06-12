#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

let programName = process.argv[1];

if (process.argv.length !== 3) {
    console.log(`Usage: ${programName} [LED pwm 0-100]`);
    process.exit(1);
}

let leftBrightnessPercent = process.argv[2] || '';
device.write(uhk.getTransferData(Buffer.from([uhk.usbCommands.setLedPwmBrightness, +leftBrightnessPercent])));
