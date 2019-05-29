#!/usr/bin/env node
const fs = require('fs');
const uhk = require('./uhk');

(async function() {
    const device = uhk.getUhkDevice();
    const buffer = Buffer.from(Array(2**15-64).fill(0xff));
    await uhk.writeConfig(device, buffer, false);
    await uhk.launchEepromTransfer(device, uhk.eepromOperations.write, uhk.configBufferIds.stagingUserConfig);
})();
