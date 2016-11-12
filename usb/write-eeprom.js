#!/usr/bin/env node
'use strict';

var usb = require('usb');
var util = require('./util');

var vid = 0x16d3;
var pid = 0x05ea;
var writeEepromCommandId = 5;

var device = usb.findByIds(vid, pid);
device.open();

var usbInterface = device.interface(0);

// https://github.com/tessel/node-usb/issues/147
// The function 'isKernelDriverActive' is not available on Windows and not even needed.
if (process.platform !== 'win32' && usbInterface.isKernelDriverActive()) {
    usbInterface.detachKernelDriver();
}
usbInterface.claim();

var endpointIn = usbInterface.endpoints[0];
var endpointOut = usbInterface.endpoints[1];
var arg = process.argv[2] || '';

if (arg.length === 0) {
    console.log('Gotta specify a string to be written to the EEPROM as the argument of this script');
    process.exit(1);
}

var payload = Buffer.concat([new Buffer([writeEepromCommandId, arg.length+2, 0x00, 0x00]), new Buffer(arg, 'utf8')]);
console.log('Sending ', util.bufferToString(payload));
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
        console.log('Received', util.bufferToString(receivedBuffer));
    })
});
