#!/usr/bin/env node
const program = require('commander');
require('shelljs/global');
require('./shared')

const extension = '.hex';
config.fatal = true;

program
    .usage(`update-master-firmware <firmware-image${extension}>`)
    .parse(process.argv)

const firmwareImage = program.args[0];
const usbDir = `${__dirname}`;
const blhost = getBlhostCmd(0x6120);

checkFirmwareImage(firmwareImage, extension);

config.verbose = true;
exec(`${usbDir}/reenumerate.js bootloader`);
exec(`${blhost} flash-security-disable 0403020108070605`);
exec(`${blhost} flash-erase-region 0xc000 475136`);
exec(`${blhost} flash-image ${firmwareImage}`);
exec(`${blhost} reset`);
config.verbose = false;

echo('Firmware updated successfully');
