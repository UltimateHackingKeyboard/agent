#!/usr/bin/env node
const path = require('path');
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function convertMs(milliseconds) {
    let days, hours, minutes, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;
    return { days, hours, minutes, seconds };
}

let buffer = new Buffer([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.uptime]);
//console.log(buffer);
device.write(uhk.getTransferData(buffer));
let response = device.readSync();
//console.log(Buffer.from(response));
let uptimeMs = uhk.getUint32(response, 1);
let uptime = convertMs(uptimeMs);
console.log(
    `Uptime: ${uptime.days}d ${String(uptime.hours).padStart(2, '0')}:${String(uptime.minutes).padStart(2, '0')}:${String(
        uptime.seconds
    ).padStart(2, '0')}`
);
