#!/usr/bin/env node
let uhk = require('./uhk');
let [endpointIn, endpointOut] = uhk.getUsbEndpoints();
var arg = process.argv[2] || '';

if (arg.length === 0) {
    console.log('Gotta specify a string to be written to the EEPROM as the argument of this script');
    process.exit(1);
}

var payload = Buffer.concat([new Buffer([uhk.usbCommands.writeEeprom, arg.length+2, 0x00, 0x00]), new Buffer(arg, 'utf8')]);
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
        console.log('Received', uhk.bufferToString(receivedBuffer));
    })
});
