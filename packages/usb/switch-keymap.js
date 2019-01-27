#!/usr/bin/env node
const uhk = require('./uhk');

(async function() {
    const keymapAbbreviation = process.argv[2];

    if (keymapAbbreviation === undefined) {
        console.log('Usage: switch-keymap.js keymapName');
        return;
    }

    const device = uhk.getUhkDevice();
    const sendData = await uhk.switchKeymap(device, keymapAbbreviation);
    console.log(sendData);
})();
