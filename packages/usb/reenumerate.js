#!/usr/bin/env node
const uhk = require('./uhk');
const program = require('commander');

program.parse(process.argv);
const enumerationMode = program.args[0];

(async function() {
    await uhk.reenumerate(enumerationMode);
})();
