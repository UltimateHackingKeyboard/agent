#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

const moduleIdToString = [
    'UnknownModule',
    'LeftKeyboardHalf',
    'KeyClusterLeft',
    'TrackballRight',
    'TrackpointRight',
    'TouchpadRight',
];

const layerNumberToString = [
    'base',
    'mod',
    'fn',
    'mouse',
];

function readKeyboardState() {
    const payload = Buffer.from([uhk.usbCommands.getDeviceState]);
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const receivedBuffer = device.readSync();
    console.log('Received', uhk.bufferToString(receivedBuffer));
    const isEepromBusy = receivedBuffer[1] !== 0 ? 'yes' : 'no ';
    const areHalvesMerged = receivedBuffer[2] !== 0 ? 'yes' : 'no ';
    const activeLayerNumber = receivedBuffer[6];
    const activelayerName = layerNumberToString[activeLayerNumber];
    console.log(
`isEepromBusy: ${isEepromBusy} | \
areHalvesMerged: ${areHalvesMerged} | \
leftKeyboardHalfSlot:${moduleIdToString[receivedBuffer[3]]} | \
leftModuleSlot:${moduleIdToString[receivedBuffer[4]]} | \
rightModuleSlot:${moduleIdToString[receivedBuffer[5]]} | \
layer:${activelayerName}`
    );
    setTimeout(readKeyboardState, 500)
}

readKeyboardState();
