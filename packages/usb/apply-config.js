#!/usr/bin/env node
const uhk = require('./uhk');

process.on('unhandledRejection', e => {throw e});

(async function() {
    const device = uhk.getUhkDevice();
    uhk.applyConfig(device);
})();
