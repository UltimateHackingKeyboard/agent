#!/usr/bin/env node
let uhk = require('./uhk');

let [endpointIn, endpointOut] = uhk.getUsbEndpoints();
let brightnessPercent = 0;

setInterval(() => {
    brightnessPercent = brightnessPercent ? 0 : 100
    console.log('Sending ', brightnessPercent);
    endpointOut.transfer(new Buffer([uhk.usbCommands.setLedPwm, brightnessPercent]), err => {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
        endpointIn.transfer(64, (err2, receivedBuffer) => {
            if (err2) {
                console.error("USB error: %s", err2);
                process.exit(2);
            }
            console.log('Received', uhk.bufferToString(receivedBuffer));
        })
    });
}, 500);
