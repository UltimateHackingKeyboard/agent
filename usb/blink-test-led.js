#!/usr/bin/env node
'use strict';

var usb = require('usb');

var vid = 0x16d3;
var pid = 0x05ea;

var device = usb.findByIds(vid, pid);
device.open();

var usbInterface = device.interface(0);
if (usbInterface.isKernelDriverActive()) {
    usbInterface.detachKernelDriver();
}
usbInterface.claim();

var endpointIn = usbInterface.endpoints[0];
var endpointOut = usbInterface.endpoints[1];

var str = '0';
console.log('Sending "%s"', str);
endpointOut.transfer(str, function(err) {
    if (err) {
        console.error("USB error: %s", err);
        process.exit(1);
    }
    endpointIn.transfer(64, function(err2, receivedStr) {
        if (err2) {
            console.error("USB error: %s", err2);
            process.exit(2);
        }
        console.log('Received "%s"', receivedStr);
    })
});
