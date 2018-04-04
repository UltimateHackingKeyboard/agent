#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const uhk = require('./uhk');

(async function() {
    const device = uhk.getUhkDevice();
    require('shelljs/global');

    program
        .usage(`config.bin`)
        .option('-h, --hardware-config', 'Write the hardware config instead of the user config')
        .parse(process.argv);

    if (program.args.length == 0) {
        console.error('No binary config file specified.');
        exit(1);
    }

    const configBin = program.args[0];
    const isHardwareConfig = program.hardwareConfig;
    const configTypeString = isHardwareConfig ? 'hardware' : 'user';
    const configBuffer = fs.readFileSync(configBin);

    await uhk.writeUserConfig(device, configBuffer, isHardwareConfig);
})();
