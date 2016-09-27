#!/usr/bin/env node
'use strict';

var usb = require('usb');
var util = require('./util');

var vid = 0x16d3;
var pid = 0x05ea;
var ledMatrixSize = 144;
var ledCountToUpdatePerCommand = ledMatrixSize / 3;
var writeLedDriverCommandId = 3;
var leftLedDriverAddress = 0b1110100;
var rightLedDriverAddress = 0b1110111;

var device = usb.findByIds(vid, pid);
device.open();

var usbInterface = device.interface(0);
if (usbInterface.isKernelDriverActive()) {
    usbInterface.detachKernelDriver();
}
usbInterface.claim();

var endpointIn = usbInterface.endpoints[0];
var endpointOut = usbInterface.endpoints[1];

var state = 1;

var ledsLeft = new Buffer(ledMatrixSize);
var ledsRight = new Buffer(ledMatrixSize);

var ledIndex = 0;
var matrixId = 0;

function updateLeds() {
    console.log('update')
    endpointOut.transfer(Buffer.concat([
        new Buffer([
            writeLedDriverCommandId,
            matrixId ? rightLedDriverAddress : leftLedDriverAddress,
            ledCountToUpdatePerCommand,
            0x24 + ledIndex
        ]),
        (matrixId ? ledsRight : ledsLeft).slice(ledIndex, ledCountToUpdatePerCommand)
    ]), function(err) {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
        console.log('update success')
        endpointIn.transfer(64, function(err2, receivedBuffer) {
            if (err2) {
                console.error("USB error: %s", err2);
                process.exit(2);
            }
            console.log('Received', util.bufferToString(receivedBuffer));

            ledIndex += ledCountToUpdatePerCommand;
            if (ledIndex >= ledMatrixSize) {
                ledIndex = 0;
            }
            matrixId = matrixId ? 0 : 1;

            updateLeds();
        })
    });
}

updateLeds();
var i = 0;
setInterval(function() {
    console.log('iter')
    ledsLeft.fill(0)
    ledsLeft[i] = 0xff;
    if (++i >= ledMatrixSize) {
        i = 0;
    }
}, 100)
