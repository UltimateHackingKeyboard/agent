#!/usr/bin/env node
const program = require('commander');
const tmp = require('tmp');
const decompress = require('decompress');
const decompressTarbz = require('decompress-tarbz2');
require('shelljs/global');

(async function() {
    try {
        config.fatal = true;

        program
            .usage(`firmwarePath`)
            .option('-u, --overwrite-user-config', 'Overwrite the user configuration with the one that is bundled with the firmware')
            .parse(process.argv);

        if (program.args.length == 0) {
            console.error('No firmware path specified.');
            exit(1);
        }

        let firmwarePath = program.args[0];

        // If a tarball is specified then extract it and override firmwarePath with the target directory name.
        if (test('-f', firmwarePath)) {
            const tmpObj = tmp.dirSync();
            await decompress(firmwarePath, tmpObj.name, {plugins: [decompressTarbz()]});
            firmwarePath = tmpObj.name;
        }
        config.verbose = true;
        exec(`${__dirname}/update-device-firmware.js ${firmwarePath}/devices/uhk60-right/firmware.hex`);
        exec(`${__dirname}/reenumerate.js normalKeyboard`);
        exec(`${__dirname}/update-module-firmware.js leftHalf ${firmwarePath}/modules/uhk60-left.bin`);

        if (program.overwriteUserConfig) {
            exec(`${__dirname}/write-config.js ${firmwarePath}/devices/uhk60-right/config.bin`);
            exec(`${__dirname}/apply-config.js`);
            exec(`${__dirname}/eeprom.js writeUserConfig`);
        }

        config.verbose = false;
    } catch(exception) {
        console.error(exception.message);
        exit(1);
    }
})();
