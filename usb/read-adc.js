#!/usr/bin/env node
let uhk = require('./uhk');
let [endpointIn, endpointOut] = uhk.getUsbEndpoints();
var arg = process.argv[2] || '';

function readAdc() {
    var payload = new Buffer([uhk.usbCommands.readAdc]);
    console.log('Sending ', uhk.bufferToString(payload));
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
            console.log('Received', uhk.bufferToString(receivedBuffer), (receivedBuffer[1]*255 + receivedBuffer[0])/4096*5.5*1.045);
            setTimeout(readAdc, 500)
        })
    });
}

readAdc();
