#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

(async function() {
    await uhk.waitForKbootIdle(device);
})();
