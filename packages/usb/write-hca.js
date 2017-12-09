#!/usr/bin/env node
const {HardwareConfiguration, UhkBuffer} = require('uhk-common');
const {EepromTransfer, getTransferBuffers, UhkHidDevice, UsbCommand} = require('uhk-usb');
const Logger = require('./logger');

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
hardwareConfig.deviceId = 1;
hardwareConfig.uuid = uuid;
hardwareConfig.brandId = 0;
hardwareConfig.isIso = layout === 'iso';
hardwareConfig.hasBacklighting = false;

const logger = new Logger();

async function writeHca() {
    const device = new UhkHidDevice(logger);
    const hardwareBuffer = new UhkBuffer();
    hardwareConfig.toBinary(hardwareBuffer);
    const buffer = hardwareBuffer.getBufferContent();
    const fragments = getTransferBuffers(UsbCommand.WriteHardwareConfig, buffer);
    logger.debug('USB[T]: Write hardware configuration to keyboard');
    for (const fragment of fragments) {
        await device.write(fragment);
    }

    logger.debug('USB[T]: Write hardware configuration to EEPROM');
    await device.writeConfigToEeprom(EepromTransfer.WriteHardwareConfig);
}

writeHca()
    .catch((err)=>{
        console.error(err);
    });
