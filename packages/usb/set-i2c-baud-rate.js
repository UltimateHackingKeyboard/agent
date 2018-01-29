#!/usr/bin/env node
const path = require('path');
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

let programName = path.basename(process.argv[1]);

if (process.argv.length !== 3) {
    console.log(`Usage: ${programName} <baud rate in Hz>
Adjust the frequency of the main I2C bus via which the right keyboard half communicates with the left half and the add-on modules.
Example values:
    * 400000 Hz - Highest speed. This will probably make communication unreliable. Not recommended.
    * 100000 Hz - Default speed. Should work in most cases.
    * 10000 Hz - Low speed. Should help when connection is spotty. It'll make initial LED display updates visibly slower.
You're free to use any value in between and test the results.`);
    process.exit(1);
}

let bps = process.argv[2];
let buffer = new Buffer(uhk.pushUint32([uhk.usbCommands.setI2cBaudRate], +bps));
//console.log(buffer);
device.write(uhk.getTransferData(buffer));
let response = device.readSync();
//console.log(Buffer.from(response));
