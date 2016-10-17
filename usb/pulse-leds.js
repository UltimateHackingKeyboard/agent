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
ledsLeft.fill(0xff)
ledsRight.fill(0xff)

var ledIndex = 0;
var matrixId = 0;

var initLedCommands = [
    [ // only enable the LEDs that are actually in the matrix
        writeLedDriverCommandId,
        leftLedDriverAddress,
        19,
        0,
        0b00000001, 0b00111111,
        0, 0b00111111,
        0, 0b00111111,
        0, 0b00011111,
        0, 0b00011111,
        0, 0b00011111,
        0, 0b00011111,
        0, 0b00011111,
        0, 0b00011111,
    ],
    [ // only enable the LEDs that are actually in the matrix
        writeLedDriverCommandId,
        leftLedDriverAddress,
        19,
        0,
        0b00000001, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
        0, 0,
    ],
    [writeLedDriverCommandId, leftLedDriverAddress, 2, 0xfd, 0x0b], // switch to function page
    [writeLedDriverCommandId, leftLedDriverAddress, 2, 0xc2, 0xff], // enable the ghost image prevention bit
    [writeLedDriverCommandId, leftLedDriverAddress, 2, 0xfd, 0x00], // switch to page 0
]

var ledCommandId = 0;

function initLeds() {
    var ledCommand = initLedCommands[ledCommandId++];
    console.log('initLeds', ledCommand);
    var buffer = new Buffer(ledCommand);

    endpointOut.transfer(buffer, function(err) {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
        if (ledCommandId < initLedCommands.length) {
            initLeds();
        } else {
            updateLeds();
        }
    });
}

function updateLeds() {
//    console.log('update')
    var buffer = Buffer.concat([
        new Buffer([
            writeLedDriverCommandId,
            matrixId ? rightLedDriverAddress : leftLedDriverAddress,
            ledCountToUpdatePerCommand,
            0x24 + ledIndex
        ]),
        (matrixId ? ledsRight : ledsLeft).slice(ledIndex, ledIndex + ledCountToUpdatePerCommand)
    ]);
    console.log('iter: '+letterIdx+' out:', util.bufferToString(buffer))
    endpointOut.transfer(buffer, function(err) {
        if (err) {
            console.error("USB error: %s", err);
            process.exit(1);
        }
//        console.log('update success')
        endpointIn.transfer(64, function(err2, receivedBuffer) {
            if (err2) {
                console.error("USB error: %s", err2);
                process.exit(2);
            }
//            console.log('Received', util.bufferToString(receivedBuffer));

            ledIndex += ledCountToUpdatePerCommand;
            if (ledIndex >= ledMatrixSize) {
                ledIndex = 0;
                matrixId = matrixId ? 0 : 1;
            }

            updateLeds();
        })
    });
}

initLeds();

var letterIdx = 0;

var lettersLeds = {
    0: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
    1: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    2: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    3: [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1],
    4: [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
    5: [1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    6: [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
    7: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    8: [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1],
    9: [1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    A: [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0],
    B: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1],
    C: [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    D: [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1],
    E: [1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    F: [1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    G: [1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
    H: [0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0],
    I: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    J: [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    K: [0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
    L: [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    M: [0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    N: [0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0],
    O: [1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    P: [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    Q: [1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1],
    R: [1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0],
    S: [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1],
    T: [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    U: [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    V: [0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    W: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0],
    X: [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0],
    Y: [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    Z: [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
}

var iconLedsToLedMatrix = [0x08, 0x09, 0x0a];
var layerLedsToLedMatrix = [0x0d, 0x1d, 0x2d];

var characterLedsToLedMatrix = [
    [0x0b, 0x1b, 0x29, 0x2a, 0x2b, 0x0c, 0x1c, 0x28, 0x1a, 0x2c, 0x38, 0x39, 0x18, 0x19],
    [0x3a, 0x4a, 0x58, 0x59, 0x5a, 0x3b, 0x4b, 0x4c, 0x49, 0x5b, 0x5c, 0x68, 0x3c, 0x48],
    [0x69, 0x79, 0x7c, 0x88, 0x89, 0x6a, 0x7a, 0x7b, 0x78, 0x8a, 0x8b, 0x8c, 0x6b, 0x6c]
]

function setIcons(iconStates) {
    for (var i=0; i<iconStates.length; i++) {
        ledsLeft[iconLedsToLedMatrix[i]] = iconStates[i] ? 0xff : 0;
    }
}

function setLayerLed(layerIdx) {
    for (var i=0; i<layerLedsToLedMatrix.length; i++) {
        ledsLeft[layerLedsToLedMatrix[i]] = i == layerIdx ? 0xff : 0;
    }
}

function setLetter(letterLeds, position) {
    for (var i=0; i<14; i++) {
        ledsLeft[characterLedsToLedMatrix[position][i]] = letterLeds[i] ? 0xff : 0;
    }
}

var digitsAndLetters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';


var letterIdx = 0;
var layerLedIdx = 0;
setInterval(function() {
setIcons([1, 1, 1]);
    for (var i=0; i<3; i++) {
        setLetter(lettersLeds[digitsAndLetters[(letterIdx+i) % digitsAndLetters.length]], i);
    }
    setLayerLed(layerLedIdx);
    if (++letterIdx >= digitsAndLetters.length) {
        letterIdx = 0;
    }
    layerLedIdx = ++layerLedIdx % layerLedsToLedMatrix.length;
}, 200);
