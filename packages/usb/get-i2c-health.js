#!/usr/bin/env node
const process = require('process');
const uhk = require('./uhk');

function slaveI2cErrorBufferToString(buffer, slaveId) {
    let statusCount = buffer[1];

    const slaveIdToName = [
        'leftHalf',
        'leftAddon',
        'rightAddon',
        'rightLedDriver',
        'leftLedDriver',
        'kboot',
    ];

    let str = `${slaveIdToName[slaveId].padEnd(14)}: `;

    const statusCodesToStrings = {
        0: 'nak',
        1: 'failure',
        1100: 'busy',
        1101: 'idle',
        1102: 'nak',
        1103: 'arbitrationLost',
        1104: 'timeout',
        20000: 'idleSlave',
        20001: 'idleCycle',
    };

    for (let i=0; i<statusCount; i++) {
        let status = uhk.getUint32(buffer, i*8+2);
        let count = uhk.getUint32(buffer, i*8+4+2);
        str += `${statusCodesToStrings[status]}:${count} `;
    }

    return str;
}

function convertMs(milliseconds) {
    let days, hours, minutes, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    days = Math.floor(hours / 24);
    hours = hours % 24;
    return {days, hours, minutes, seconds};
}

const device = uhk.getUhkDevice();

device.write(uhk.getTransferData(new Buffer(uhk.pushUint32([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.uptime]))));
let response = device.readSync();
let uptimeMs = uhk.getUint32(response, 1);
let uptime = convertMs(uptimeMs);
console.log(`uptime: ${uptime.days}d ${String(uptime.hours).padStart(2, '0')}:${String(uptime.minutes).padStart(2, '0')}:${String(uptime.seconds).padStart(2, '0')}`)

device.write(uhk.getTransferData(new Buffer(uhk.pushUint32([uhk.usbCommands.getDeviceProperty, uhk.devicePropertyIds.i2cBaudRate]))));
response = device.readSync();
let requestedBaudRate = uhk.getUint32(response, 2);
let actualBaudRate = uhk.getUint32(response, 6);
console.log(`requestedBaudRate:${requestedBaudRate} | actualBaudRate:${actualBaudRate} | I2C0_F:0b${response[1].toString(2).padStart(8, '0')}`)

for (let slaveId=0; slaveId<6; slaveId++) {
    device.write(uhk.getTransferData(new Buffer([uhk.usbCommands.getSlaveI2cErrors, slaveId])));
    let response = Buffer.from(device.readSync());
    let str = slaveI2cErrorBufferToString(response, slaveId);
    console.log(str);
}
