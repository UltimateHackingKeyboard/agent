#!/usr/bin/env node
const uhk = require('./uhk');
const device = uhk.getUhkDevice();

process.on('unhandledRejection', e => {throw e});

(async function() {
    const operationArg = process.argv[2];
    const operation = uhk.eepromOperations[operationArg];
    if (operation === undefined) {
        console.error(`Invalid operation: Gotta provide one of ${Object.keys(uhk.eepromOperations).join(', ')}`);
        process.exit(1);
    }

    const bufferIdArg = process.argv[3];
    const bufferId = uhk.configBufferIds[bufferIdArg]
    if (bufferId === undefined) {
        console.error(`Invalid bufferId: Gotta provide one of ${Object.keys(uhk.configBufferIds).join(', ')}`);
        process.exit(1);
    }

    const buffer = await uhk.launchEepromTransfer(device, operation, bufferId);
})();
