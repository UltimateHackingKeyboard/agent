#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function getUint32(buffer, offset) {
    return (buffer[offset]) + (buffer[offset+1] << 8) + (buffer[offset+2] << 16) + (buffer[offset+3] << 24);
}

function getDebugInfo() {
    const payload = new Buffer([uhk.usbCommands.getDebugInfo]);
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const rxBuffer = Buffer.from(device.readSync());
    console.log('Received', uhk.bufferToString(rxBuffer));
    process.stdout.write(`I2C_Watchdog:${getUint32(rxBuffer, 1)} | `);
    process.stdout.write(`I2cSlaveScheduler_Counter:${getUint32(rxBuffer, 5)} | `);
    process.stdout.write(`I2cWatchdog_WatchCounter:${getUint32(rxBuffer, 9)} | `);
    process.stdout.write(`I2cWatchdog_RecoveryCounter:${getUint32(rxBuffer, 13)}`);
    process.stdout.write('\n');
    setTimeout(getDebugInfo, 500);
}

getDebugInfo();
