#!/usr/bin/env node
const uhk = require('./uhk');

(async function() {
    const device = uhk.getUhkDevice();
    uhk.applyConfig(device);
})();
