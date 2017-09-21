#!/usr/bin/env node
const {HardwareConfiguration, LogService, UhkBuffer} = require('uhk-common');
const {EepromTransfer, UhkHidDevice, UsbCommand} = require('uhk-usb');

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
const hardwareConfig = new HardwareConfiguration();

hardwareConfig.signature = 'UHK';
hardwareConfig.dataModelVersion = 0;
hardwareConfig.hardwareId = 0;
hardwareConfig.uuid = uuid;
hardwareConfig.brandId = 0;
hardwareConfig.isIso = layout === 'iso';
hardwareConfig.hasBacklighting = false;

async function writeHca() {
    const device = new UhkHidDevice(new LogService());
    const hardwareBuffer = new UhkBuffer();
    hardwareConfig.toBinary(hardwareBuffer);
    const buffer = hardwareBuffer.buffer.slice(0, 60);
    const fragments = UhkHidDevice.getTransferBuffers(UsbCommand.WriteHardwareConfig, buffer);
    for (const fragment of fragments) {
        await device.write(fragment);
    }

    await device.writeConfigToEeprom(EepromTransfer.WriteHardwareConfig);
}

writeHca();
