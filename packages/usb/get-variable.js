#!/usr/bin/env node
const uhk = require('./uhk');

(async function() {
    const device = uhk.getUhkDevice();
    const variableName = process.argv[2];
    const variableId = uhk.variableNameToId[variableName];

    if (variableId === undefined) {
        console.log(
            `The specified variable does not exist. Specify one of ${Object.keys(uhk.variableNameToId).join(', ')}`,
        );
        process.exit(1);
    }

    const receivedBuffer = await uhk.writeDevice(device, [uhk.usbCommands.getVariable, variableId]);
    console.log(receivedBuffer[1]);
})();
