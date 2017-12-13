#!/usr/bin/env node
const {HardwareConfiguration, UhkBuffer} = require('uhk-common');
const {EepromTransfer, getTransferBuffers, ConfigBufferId, UhkHidDevice, UsbCommand} = require('uhk-usb');
const Logger = require('./logger');

if (process.argv.length < 2) {
    console.log(`use: write-hca {iso|ansi}`);
    process.exit(1);
}

const layout = process.argv[2];
if (layout !== 'iso' && layout !== 'ansi') {
    console.log('Invalid layout. Layout should be either iso or ansi');
    process.exit(1);
}

const hardwareConfig = new HardwareConfiguration();

hardwareConfig.signature = 'UHK';
hardwareConfig.majorVersion = 1;
hardwareConfig.minorVersion = 0;
hardwareConfig.patchVersion = 0;
hardwareConfig.brandId = 0;
hardwareConfig.deviceId = 1;
hardwareConfig.uniqueId = Math.floor(2**32 * Math.random());
hardwareConfig.isVendorModeOn = false;
hardwareConfig.isIso = layout === 'iso';

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
    await device.writeConfigToEeprom(ConfigBufferId.hardwareConfig);
}

writeHca()
    .catch((err)=>{
        console.error(err);
    });
