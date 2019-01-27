#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const uhk = require('./uhk');
require('shelljs/global');

(async function() {
    config.fatal = true;

    program.usage(`firmwarePath`).parse(process.argv);

    if (program.args.length < 1) {
        console.error('No firmware path specified.');
        exit(1);
    }
    const firmwarePath = program.args[0];

    if (program.args.length < 2) {
        console.error('No layout specified.');
        exit(1);
    }
    const layout = program.args[1];
    if (!['ansi', 'iso'].includes(layout)) {
        console.error('The specified layout is neither ansi nor iso.');
        exit(1);
    }
    const isIso = layout === 'iso';

    config.verbose = true;
    await uhk.updateFirmwares(firmwarePath);
    const device = uhk.getUhkDevice();
    const configBuffer = fs.readFileSync(`${firmwarePath}/devices/uhk60-right/config.bin`);
    await uhk.writeUca(device, configBuffer);
    await uhk.writeHca(device, isIso);
    await uhk.switchKeymap(device, 'TES');
    console.log('All done!');
    config.verbose = false;
})();
