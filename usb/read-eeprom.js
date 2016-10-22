#!/usr/bin/env node
'use strict';

var usb = require('usb');
var util = require('./util');

var vid = 0x16d3;
var pid = 0x05ea;
var readEepromCommandId = 6;

var device = usb.findByIds(vid, pid);
device.open();

var usbInterface = device.interface(0);
if (usbInterface.isKernelDriverActive()) {
    usbInterface.detachKernelDriver();
}
usbInterface.claim();

var endpointIn = usbInterface.endpoints[0];
var endpointOut = usbInterface.endpoints[1];

var payload = new Buffer([readEepromCommandId, 63, 0x00, 0x00]);
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
