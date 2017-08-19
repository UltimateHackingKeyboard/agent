#!/usr/bin/env node
let uhk = require('./uhk');
let [endpointIn, endpointOut] = uhk.getUsbEndpoints();
var arg = process.argv[2] || '';
let lastWatchdogCounter = -1;

function monitorI2c() {
    var payload = new Buffer([uhk.usbCommands.readDebugInfo]);
//    console.log('Sending ', uhk.bufferToString(payload));
    endpointOut.transfer(payload, function(err) {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
        endpointIn.transfer(64, function(err2, receivedBuffer) {
            if (err2) {
                console.error("USB error: %s", err2);
                process.exit(2);
            }
            let watchdogCounter = (receivedBuffer[1] << 0) + (receivedBuffer[2] << 8) + (receivedBuffer[3] << 16) + (receivedBuffer[4] << 24);
            if (watchdogCounter === lastWatchdogCounter) {
                process.exit(0);
            }
//            console.log('Received', watchdogCounter);
            setTimeout(monitorI2c, 100)
        })
    });
}

monitorI2c();
