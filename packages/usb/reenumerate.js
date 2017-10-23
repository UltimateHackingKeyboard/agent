#!/usr/bin/env node
const HID = require('node-hid');
let uhk = require('./uhk');
var program = require('commander');

program
    .option('-dt, --polling-timeout <n>', 'Polling timeout (ms)')
    .option('-bt, --bootloader-timeout <n>', 'Bootloader timeout (ms)')
    .option('-f, --force', 'Force reenumeration')
    .parse(process.argv);

let pollingTimeoutMs = 10000;
const pollingIntervalMs = 100;
const bootloaderTimeoutMs = 5000;
let jumped = false;

const enumerationMode = program.args[0];
const enumerationModeId = uhk.enumerationModes[enumerationMode];

if (enumerationModeId === undefined) {
    const enumerationModes = Object.keys(uhk.enumerationModes).join(', ');
    console.log(`Invalid enumeration mode '${enumerationMode}' is not one of: ${enumerationModes}`);
    process.exit(1);
}

console.log(`Trying to reenumerate as ${enumerationMode}...`);
setInterval(() => {
    pollingTimeoutMs -= pollingIntervalMs;

    const foundDevice = HID.devices().find(device =>
        device.vendorId === uhk.vendorId && device.productId === uhk.enumerationModeIdToProductId[enumerationModeId]);

    if (foundDevice) {
        console.log(`${enumerationMode} is up`);
        process.exit(0);
    }

    if (pollingTimeoutMs <= 0) {
        console.log(`Couldn't reenumerate as ${enumerationMode}`);
        process.exit(1);
    }

    let device = uhk.getUhkDevice();
    if (device && !jumped) {
        console.log(`UHK found, reenumerating as ${enumerationMode}`);
        let t =  bootloaderTimeoutMs;
        let message = new Buffer([uhk.usbCommands.reenumerate, enumerationModeId, t&0xff, (t&0xff<<8)>>8, (t&0xff<<16)>>16, (t&0xff<<24)>>24]);
        device.write(uhk.getTransferData(message));
        jumped = true;
    }

}, pollingIntervalMs);
