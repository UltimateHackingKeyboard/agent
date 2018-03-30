#!/usr/bin/env node
const uhk = require('./uhk');

(async function() {
    const device = uhk.getUhkDevice();
    const sendData = await uhk.switchKeymap(device, 'TES');
    console.log(sendData)
})();
