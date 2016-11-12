#!/usr/bin/env node
'use strict';

var usb = require('usb');
var util = require('./util');

var vid = 0x16d3;
var pid = 0x05ea;
var test_led_command_id = 2;

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

var state = 1;

setInterval(function() {
    state = state ? 0 : 1
    console.log('Sending ', state);
    endpointOut.transfer(new Buffer([test_led_command_id, state]), function(err) {
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
}, 500)
