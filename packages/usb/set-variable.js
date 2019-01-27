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

    await uhk.writeDevice(device, [uhk.usbCommands.setVariable, variableId, +process.argv[3]]);
})();
