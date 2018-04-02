#!/usr/bin/env node
const uhk = require('./uhk');

(async function() {
    const device = uhk.getUhkDevice();
    await uhk.getModuleProperty(device, 1, uhk.modulePropertyIds.protocolVersions);
})();
