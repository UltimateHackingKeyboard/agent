#!/usr/bin/env node
'use strict';

var usb = require('usb');
var util = require('./util');

var vid = 0x16d3;
var pid = 0x05ea;
var readIsoJumperCommandId = 9;

var device = usb.findByIds(vid, pid);
device.open();

var usbInterface = device.interface(0);
if (usbInterface.isKernelDriverActive()) {
    usbInterface.detachKernelDriver();
}
usbInterface.claim();

var endpointIn = usbInterface.endpoints[0];
var endpointOut = usbInterface.endpoints[1];

function readLedJumper() {
    var payload = new Buffer([readIsoJumperCommandId]);
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
            var isIso = receivedBuffer[1] === 0;
            console.log('ISO jumper is ' + (isIso ? 'closed' : 'open') + ' so the detected layout is ' + (isIso ? 'ISO' : 'ANSI'));
            console.log('Restart the UHK after switching the switch for the change to take effect!');
        })
    });
}

readLedJumper();
