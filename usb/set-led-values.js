#!/usr/bin/env node
let uhk = require('./uhk');

let programName = process.argv[1];

if (process.argv.length !== 6) {
    console.log(`Usage: ${programName} [display 0-255] [left keys 0-255] [unused 0-255] [right keys 0-255]`);
    process.exit(1);
}

let pwmOffset = 0;
let ledDriverAddresses = [uhk.leftLedDriverAddress, uhk.rightLedDriverAddress];
let ledDriverAddress;
const FRAME_REGISTER_PWM_FIRST = 0x24;

uhk.sendUsbPacketsByCallback(() => {
    if (pwmOffset === 0) {
        ledDriverAddress = ledDriverAddresses.shift();
    }
    if (!ledDriverAddress) {
        return;
    }

    let isMatrixA = pwmOffset % 16;
    let argIndex = 2 + (ledDriverAddress == uhk.leftLedDriverAddress ? 0 : 2) + (isMatrixA ? 0 : 1);
    let val = +process.argv[argIndex];
    let buffer = new Buffer([uhk.usbCommands.writeLedDriver, ledDriverAddress,
                             9, FRAME_REGISTER_PWM_FIRST+pwmOffset, val, val, val, val, val, val, val, val]);
    pwmOffset += 8;

    if (pwmOffset >= 144) {
        pwmOffset = 0;
    }

    return buffer;
});
