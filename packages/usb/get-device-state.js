#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

function readKeyboardState() {
    const payload = Buffer.from([uhk.usbCommands.getDeviceState]);
    console.log('Sending ', uhk.bufferToString(payload));
    device.write(uhk.getTransferData(payload));
    const receivedBuffer = device.readSync();
    console.log('Received', uhk.bufferToString(receivedBuffer));
    const isEepromBusy = receivedBuffer[1] !== 0 ? 'yes' : 'no ';
    const areHalvesMerged = receivedBuffer[2] !== 0 ? 'yes' : 'no ';
    const isLeftHalfConnected = receivedBuffer[3] !== 0 ? 'yes' : 'no ';
    const activeLayerNumber = receivedBuffer[6];
    const activelayerName = ['base', 'mod', 'fn', 'mouse'][activeLayerNumber];
    console.log(`isEepromBusy: ${isEepromBusy} | areHalvesMerged: ${areHalvesMerged} | isLeftHalfConnected:${isLeftHalfConnected} | ${activelayerName} layer`);
    setTimeout(readKeyboardState, 500)
}

readKeyboardState();
