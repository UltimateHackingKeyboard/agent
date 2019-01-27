#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

(async function() {
    let response = await uhk.writeDevice(device, [
        uhk.usbCommands.getDeviceProperty,
        uhk.devicePropertyIds.i2cBaudRate,
    ]);
    let requestedBaudRate = uhk.getUint32(response, 2);
    let actualBaudRate = uhk.getUint32(response, 6);
    let i2c0F = response[1].toString(2).padStart(8, '0');
    console.log(`requestedBaudRate:${requestedBaudRate} | actualBaudRate:${actualBaudRate} | I2C0_F:0b${i2c0F}`);
})();
