#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const uhk = require('./uhk')
require('shelljs/global');

(async function() {
    config.fatal = true;

    program
        .usage(`firmwarePath`)
        .parse(process.argv);

    if (program.args.length == 0) {
        console.error('No firmware path specified.');
        exit(1);
    }

    config.verbose = true;
    const firmwarePath = program.args[0];
    await uhk.updateFirmwares(firmwarePath);
    const device = uhk.getUhkDevice();
    const configBuffer = fs.readFileSync(`${firmwarePath}/devices/uhk60-right/config.bin`);
    await uhk.writeUca(device, configBuffer);
    await uhk.writeHca(device, false);
    config.verbose = false;
})();
