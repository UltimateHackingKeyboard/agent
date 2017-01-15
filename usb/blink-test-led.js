#!/usr/bin/env node
'use strict';

let uhk = require('./uhk');
let [endpointIn, endpointOut] = uhk.getUsbEndpoints();

var state = 1;

setInterval(function() {
    state = state ? 0 : 1
    console.log('Sending ', state);
    endpointOut.transfer(new Buffer([uhk.usbCommands.setTestLed, state]), function(err) {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
        endpointIn.transfer(64, function(err2, receivedBuffer) {
            if (err2) {
                console.error("USB error: %s", err2);
                process.exit(2);
            }
            console.log('Received', uhk.bufferToString(receivedBuffer));
        })
    });
}, 500)
