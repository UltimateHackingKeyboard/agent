#!/usr/bin/env node
const program = require('commander');
require('shelljs/global');
require('./shared')

const extension = '.bin';
config.fatal = true;

program
    .usage(`update-slave-firmware <firmware-image${extension}>`)
    .parse(process.argv)

const firmwareImage = program.args[0];
const usbDir = `${__dirname}`;
const blhostUsb = getBlhostCmd(0x6121);
const blhostBuspal = `${blhostUsb} --buspal i2c,0x10,100k`;

checkFirmwareImage(firmwareImage, extension);

config.verbose = true;
exec(`${usbDir}/send-kboot-command-to-slave.js ping 0x10`);
exec(`${usbDir}/jump-to-slave-bootloader.js`);
exec(`${usbDir}/reenumerate.js buspal`);
execRetry(`${blhostBuspal} get-property 1`);
exec(`${blhostBuspal} flash-erase-all-unsecure`);
exec(`${blhostBuspal} write-memory 0x0 ${firmwareImage}`);
exec(`${blhostUsb} reset`);
exec(`${usbDir}/reenumerate.js normalKeyboard`);
execRetry(`${usbDir}/send-kboot-command-to-slave.js reset 0x10`);
config.verbose = false;

echo('Firmware updated successfully');
