#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const uhk = require('./uhk')
require('shelljs/global');

(async function() {
    try {
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
        console.log('write config');
        await uhk.writeConfig(device, configBuffer, false);
        console.log('apply config');
        await uhk.applyConfig(device);
        console.log('lanuch eeprom transfer');
        await uhk.launchEepromTransfer(device, uhk.eepromOperations.write, uhk.eepromTransfer.writeUserConfig);
        config.verbose = false;

    } catch (exception) {
        console.error(exception.message);
        exit(1);
    }
})();
