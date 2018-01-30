#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');
require('shelljs/global');
require('./shared');

const extension = '.bin';
config.fatal = true;

program
    .usage(`moduleSlot firmwareImage${extension}`)
    .parse(process.argv)

let moduleSlot = program.args[0];
const i2cAddress = uhk.checkModuleSlot(moduleSlot, uhk.moduleSlotToI2cAddress);

const firmwareImage = program.args[1];
uhk.checkFirmwareImage(firmwareImage, extension);

const usbDir = `${__dirname}`;
const blhostUsb = uhk.getBlhostCmd(uhk.enumerationNameToProductId.buspal);
const blhostBuspal = `${blhostUsb} --buspal i2c,${i2cAddress}`;

config.verbose = true;
exec(`${usbDir}/send-kboot-command-to-module.js ping ${moduleSlot}`);
exec(`${usbDir}/jump-to-module-bootloader.js ${moduleSlot}`);
exec(`${usbDir}/wait-for-kboot-idle.js`);
exec(`${usbDir}/reenumerate.js buspal`);
execRetry(`${blhostBuspal} get-property 1`);
exec(`${blhostBuspal} flash-erase-all-unsecure`);
exec(`${blhostBuspal} write-memory 0x0 ${firmwareImage}`);
exec(`${blhostUsb} reset`);
exec(`${usbDir}/reenumerate.js normalKeyboard`);
execRetry(`${usbDir}/send-kboot-command-to-module.js reset ${moduleSlot}`);
exec(`${usbDir}/send-kboot-command-to-module.js idle`);
config.verbose = false;

echo('Firmware updated successfully.');
