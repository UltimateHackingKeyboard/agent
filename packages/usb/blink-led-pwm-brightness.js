#!/usr/bin/env node
const uhk = require('./uhk');

let areLedsEnabled = true;

const device = uhk.getUhkDevice();
setInterval(() => {
    areLedsEnabled = !areLedsEnabled;
    const brightnessPercent = areLedsEnabled ? 100 : 0;

    device.write(uhk.getTransferData(Buffer.from([uhk.usbCommands.setLedPwmBrightness, brightnessPercent])));
}, 500);
