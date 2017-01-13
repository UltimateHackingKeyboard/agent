#!/usr/bin/env node
'use strict';

var usb = require('usb');
var util = require('./util');

var vid = 0x16d3;
var pid = 0x05ea;
var LED_PWM_COMMAND_ID = 10;

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

var brightnessPercent = 0;

setInterval(function() {
    brightnessPercent = brightnessPercent ? 0 : 100
    console.log('Sending ', brightnessPercent);
    endpointOut.transfer(new Buffer([LED_PWM_COMMAND_ID, brightnessPercent]), function(err) {
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
