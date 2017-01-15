#!/usr/bin/env node
let util = require('./util');

let LED_PWM_COMMAND_ID = 10;
let [endpointIn, endpointOut] = util.getUsbEndpoints();
let brightnessPercent = 0;

setInterval(() => {
    brightnessPercent = brightnessPercent ? 0 : 100
    console.log('Sending ', brightnessPercent);
    endpointOut.transfer(new Buffer([LED_PWM_COMMAND_ID, brightnessPercent]), err => {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
        endpointIn.transfer(64, (err2, receivedBuffer) => {
            if (err2) {
                console.error("USB error: %s", err2);
                process.exit(2);
            }
            console.log('Received', util.bufferToString(receivedBuffer));
        })
    });
}, 500);
