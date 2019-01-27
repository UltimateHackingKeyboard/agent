#!/usr/bin/env node
const process = require('process');
const uhk = require('./uhk');

const slaveId = parseInt(process.argv[2]);

const device = uhk.getUhkDevice();
const sendData = new Buffer([uhk.usbCommands.getSlaveI2cErrors, slaveId]);
device.write(uhk.getTransferData(sendData));
const response = Buffer.from(device.readSync());

//console.log(response);
let status = response[0];

if (status != 0) {
    console.log('Invalid slave id');
    process.exit(1);
}

function slaveI2cErrorBufferToString(buffer) {
    let statusCount = buffer[1];

    const slaveIdToName = ['leftHalf', 'leftAddon', 'rightAddon', 'rightLedDriver', 'leftLedDriver', 'kboot'];

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
        20001: 'idleCycle'
    };

    for (let i = 0; i < statusCount; i++) {
        let status = uhk.getUint32(buffer, i * 8 + 2);
        let count = uhk.getUint32(buffer, i * 8 + 4 + 2);
        str += `${statusCodesToStrings[status]}:${count} `;
    }

    return str;
}

let str = slaveI2cErrorBufferToString(response);
console.log(str);
