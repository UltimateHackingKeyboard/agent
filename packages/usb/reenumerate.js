#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');

program
    .option('-t, --timeout <ms>', 'Bootloader timeout in ms', 5000)
    .parse(process.argv);

const enumerationMode = program.args[0];

(async function() {
    await uhk.reenumerate(enumerationMode, program.timeout);
})();
