#!/usr/bin/env node
const uhk = require('./uhk');

if (process.argv.length < 3) {
    console.log(`use: write-hca <layout> <manufactureId>

- layout:           iso or ansi
- manufactureId:    max 32 bit integer
`);
    process.exit(1);
}

const layout = process.argv[2];
if (layout !== 'iso' && layout !== 'ansi') {
    console.log('Invalid layout. Layout should be on of: iso, ansi');
    process.exit(1);
}

const uuid = Number.parseInt(process.argv[3]);

if (isNaN(uuid)) {
    console.log('Manufacture Id is not a integer');
    process.exit(1);
}

const signature = 'UHK';
const dataModelVersion = 0;
const hardwareId = 0;
const brandId = 0;
const isIso = layout === 'iso' ? 1 : 0;
const hasBacklighting = 0;

const device = uhk.getUhkDevice();
const payload = uhk.getTransferData(Buffer.concat([
    Buffer.from([uhk.usbCommands.writeHardwareConfig]),
    Buffer.from(signature),
    Buffer.from([dataModelVersion, hardwareId, uuid, brandId, isIso, hasBacklighting])
]));
uhk.sendLog(payload);
device.write(payload);
const response = Buffer.from(device.readSync());
uhk.readLog(response);

if (response[0] !== 0) {
    process.exit(response[0]);
}
