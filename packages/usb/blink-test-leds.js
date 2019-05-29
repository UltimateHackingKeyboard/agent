#!/usr/bin/env node
let uhk = require('./uhk');

let areLedsEnabled = true;

const device = uhk.getUhkDevice();
setInterval(() => {
    areLedsEnabled = !areLedsEnabled;

    device.write(uhk.getTransferData(Buffer.from([uhk.usbCommands.setTestLed, areLedsEnabled ? 1 : 0])));
}, 500);
