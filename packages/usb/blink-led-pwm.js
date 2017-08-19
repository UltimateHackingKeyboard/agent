#!/usr/bin/env node
let uhk = require('./uhk');

let delayCycle = true;
let areLedsEnabled = true;

uhk.sendUsbPacketsByCallback(() => {
    delayCycle = !delayCycle;
    if (delayCycle) {
        return new uhk.DelayMs(500);
    } else {
        areLedsEnabled = !areLedsEnabled;
        let brightnessPercent = areLedsEnabled ? 100 : 0;
        return new Buffer([uhk.usbCommands.setLedPwm, brightnessPercent]);
    }
});
