#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import { devicesAsync } from 'node-hid';
import { SerialPort } from 'serialport';
import {
    ALL_UHK_DEVICES,
    FIRMWARE_UPGRADE_METHODS,
    VidPidPair,
} from 'uhk-common';
import {
    isUhkCommunicationUsage,
    snooze,
} from 'uhk-usb';

import { yargs } from './src/index.js';

const REENUMERATION_MODES = ['device', 'bootloader', 'buspal'];
const reenumerationOptions = REENUMERATION_MODES.join('|');
const devicesOptions = ALL_UHK_DEVICES.map(uhkDevice => uhkDevice.asCliArg).join('|');

const argv = yargs
    .scriptName('./wait-for-device.ts')
    .usage(`Usage: $0 {${devicesOptions}} {${reenumerationOptions}} timeout`)
    .demandCommand(2, 'Device and enumeration mode are required. Timeout in seconds is optional, default value 5 seconds.')
    .argv;

const deviceArg = argv._[0] as string;
const enumerationModeArg = argv._[1] as string;
const timeoutArg = argv._[2] as string;

const uhkDeviceProduct = ALL_UHK_DEVICES.find(uhkDevice => uhkDevice.asCliArg === deviceArg);

if (!uhkDeviceProduct) {
    console.error(`Invalid device: ${deviceArg}. Available options: ${devicesOptions}`);
    process.exit(1);
}

const reenumerationMode = REENUMERATION_MODES.find(value => value === enumerationModeArg);

if (!reenumerationMode) {
    console.error(`Invalid reenumeration mode: ${enumerationModeArg}. Available options: ${reenumerationOptions}`);
    process.exit(1);
}

if (reenumerationMode === 'buspal' && uhkDeviceProduct.buspal.length === 0) {
    console.error(`${deviceArg} does not support buspal reenumeration mode.`);
    process.exit(1);
}

let timeout = 5000;

if (timeoutArg) {
    const tmpTimeout = Number(timeoutArg);
    if (Number.isNaN(tmpTimeout)) {
        console.error(`Invalid timeout: ${timeoutArg}. Please provide a number.`);
        process.exit(1);
    }

    timeout = tmpTimeout;
}


let vidPids: VidPidPair[];

if (reenumerationMode === 'device') {
    vidPids = uhkDeviceProduct.keyboard;
}
else if (reenumerationMode === 'bootloader') {
    vidPids = uhkDeviceProduct.bootloader;
}
else if (reenumerationMode === 'buspal') {
    vidPids = uhkDeviceProduct.buspal;
}
else {
    console.error(`Not implemented reenumeration mode mapping: ${reenumerationMode}`);
}

const startTime = new Date();

let found = false;

while (new Date().getTime() - startTime.getTime() < timeout && !found) {

    if (reenumerationMode === 'bootloader' && uhkDeviceProduct.firmwareUpgradeMethod === FIRMWARE_UPGRADE_METHODS.MCUBOOT) {
        const serialDevices = await SerialPort.list();

        for (const serialDevice of serialDevices) {
            found = vidPids.some(vidPid => Number.parseInt(serialDevice.vendorId, 16) === vidPid.vid && Number.parseInt(serialDevice.productId, 16) === vidPid.pid);

            if (found) {
                break;
            }
        }
    }
    else {
        const hidDevices = await devicesAsync();
        for (const hidDevice of hidDevices) {
            found = vidPids.some(vidPid => {
                return vidPid.vid === hidDevice.vendorId && vidPid.pid === hidDevice.productId
                && (reenumerationMode !== 'device' || isUhkCommunicationUsage(hidDevice));
            });

            if (found) {
                break;
            }
        }
    }

    await snooze(100);
}

if (found) {
    process.exit(0);
}
else {
    console.error('Cannot find device within timeout');
    process.exit(1);
}
