#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');
require('shelljs/global');
require('./shared')

const extension = '.bin';
config.fatal = true;

program
    .usage(`update-slave-firmware <module-slot> <firmware-image${extension}>`)
    .parse(process.argv)

let moduleSlot = program.args[0];
let i2cAddress = uhk.moduleSlotToI2cAddress[moduleSlot];

if (!i2cAddress) {
    echo(`Invalid module slot specified.`);
    echo(`Valid slots are: ${Object.keys(uhk.moduleSlotToI2cAddress).join(', ')}.`);
    exit(1);
}

i2cAddress = `0x${i2cAddress.toString(16)}`;

const firmwareImage = program.args[1];
checkFirmwareImage(firmwareImage, extension);

const usbDir = `${__dirname}`;
const blhostUsb = getBlhostCmd(0x6121);
const blhostBuspal = `${blhostUsb} --buspal i2c,${i2cAddress},100k`;

config.verbose = true;
exec(`${usbDir}/send-kboot-command-to-slave.js ping ${i2cAddress}`);
exec(`${usbDir}/jump-to-slave-bootloader.js`);
exec(`${usbDir}/reenumerate.js buspal`);
execRetry(`${blhostBuspal} get-property 1`);
exec(`${blhostBuspal} flash-erase-all-unsecure`);
exec(`${blhostBuspal} write-memory 0x0 ${firmwareImage}`);
exec(`${blhostUsb} reset`);
exec(`${usbDir}/reenumerate.js normalKeyboard`);
execRetry(`${usbDir}/send-kboot-command-to-slave.js reset ${i2cAddress}`);
config.verbose = false;

echo('Firmware updated successfully.');
