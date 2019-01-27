#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');
require('shelljs/global');

config.fatal = true;
const extension = '.hex';

program.usage(`firmwareImage${extension}`).parse(process.argv);

const firmwareImage = program.args[0];
uhk.updateDeviceFirmware(firmwareImage, extension);
