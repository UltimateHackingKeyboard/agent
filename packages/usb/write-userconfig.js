#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const uhk = require('./uhk');

(async function() {
    program
        .usage(`configPath`)
        .parse(process.argv);

    if (program.args.length < 1) {
        console.error('No configPath path specified.');
        exit(1);
    }
    const configPath = program.args[0];

    const device = uhk.getUhkDevice();
    const configBuffer = fs.readFileSync(configPath);
    await uhk.writeConfig(device, configBuffer, false);
    await uhk.applyConfig(device);
    await uhk.launchEepromTransfer(device, uhk.eepromOperations.write, uhk.configBufferIds.validatedUserConfig);
})();
