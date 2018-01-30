#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');
require('shelljs/global');

config.fatal = true;
const extension = '.hex';

program
    .usage(`firmwareImage${extension}`)
    .parse(process.argv)

const firmwareImage = program.args[0];

async function updateDeviceFirmware(firmwareImage, extension) {
    const usbDir = `${__dirname}`;
    const blhost = uhk.getBlhostCmd(uhk.enumerationNameToProductId.bootloader);

    uhk.checkFirmwareImage(firmwareImage, extension);
    config.verbose = true;

    await uhk.reenumerate('bootloader');
    exec(`${blhost} flash-security-disable 0403020108070605`);
    exec(`${blhost} flash-erase-region 0xc000 475136`);
    exec(`${blhost} flash-image ${firmwareImage}`);
    exec(`${blhost} reset`);

    config.verbose = false;
    echo('Firmware updated successfully.');
};

updateDeviceFirmware(firmwareImage, extension);
