#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import fs from 'fs';
import { Device } from 'node-hid';
import path from 'node:path';
import {
    FirmwareJson,
    UHK_80_DEVICE,
    UHK_80_DEVICE_LEFT,
    UhkDeviceProduct,
} from 'uhk-common';
import {
    getCurrenUhk80LeftHID,
    getCurrenUhk80RightHID,
    getDeviceUserConfigPath,
    getDeviceFirmwarePath,
    getFirmwarePackageJson,
    TmpFirmware,
    snooze,
    UhkHidDevice,
    UhkOperations,
    UsbVariables,
    waitForUhkDeviceConnected,
} from 'uhk-usb';

import Uhk, { errorHandler, yargs } from './src/index.js';

const argv = yargs
    .scriptName('./factory-update-uhk80.ts')
    .usage('Usage: $0 <firmwarePath>  {iso|ansi}')
    .demandCommand(2, 'Firmware path and layout are required')
    .option('set-serial-number', {
        description: 'Use the given serial number instead of randomly generated one.',
        type: 'number',
    })
    .argv as any;

const firmwarePath = argv._[0] as string;
const layout = argv._[1] as string;

const { logger, rootDir } = Uhk(argv);

try {
    let connectedDevices = await getHidDevices();

    const firmwareDirectoryInfo: TmpFirmware = {
        packageJsonPath: path.join(firmwarePath, 'package.json'),
        tmpDirectory: firmwarePath,
    };

    const firmwarePackageJson = await getFirmwarePackageJson(firmwareDirectoryInfo);

    const firmwareUpgradesResults = await Promise.all([
        upgradeFirmware(UHK_80_DEVICE, connectedDevices.rightHidDevice, firmwarePackageJson),
        upgradeFirmware(UHK_80_DEVICE_LEFT, connectedDevices.leftHidDevice, firmwarePackageJson),
    ]);

    assertOperationResults(firmwareUpgradesResults, 'Firmware upgrade failed: ');

    // just wait until devices be ready. After the reenumeration the halves start to communicate with each other
    // give them some time to finish
    await snooze(5000);

    // Need to reload hid devices because after the reenumeration maybe the HID device path changed
    connectedDevices = await getHidDevices();

    const writeHardwareConfigResults = await Promise.all([
        writeHardwareConfig(UHK_80_DEVICE, connectedDevices.rightHidDevice, layout),
        writeHardwareConfig(UHK_80_DEVICE_LEFT, connectedDevices.leftHidDevice, layout),
    ]);

    assertOperationResults(writeHardwareConfigResults, 'Hardware configuration write failed: ');

    await snooze(5000); // just wait until devices be ready

    // re-read hid devices just to be sure
    connectedDevices = await getHidDevices();

    let leftUhkDevice: UhkHidDevice;
    let rightUhkDevice: UhkHidDevice;
    try {
        leftUhkDevice = new UhkHidDevice(logger, {}, rootDir, connectedDevices.leftHidDevice);
        rightUhkDevice = new UhkHidDevice(logger, {}, rootDir, connectedDevices.rightHidDevice);
        const rightUhkOperations = new UhkOperations(logger, rightUhkDevice);
        const leftUhkOperations = new UhkOperations(logger, leftUhkDevice);

        // Save user-config to the right half
        const userConfigPath = getDeviceUserConfigPath(UHK_80_DEVICE, firmwarePackageJson);
        const configBuffer = fs.readFileSync(userConfigPath) as any;
        await rightUhkOperations.saveUserConfiguration(configBuffer);

        // pair left and right half
        await rightUhkOperations.pairToLeftHalf(leftUhkDevice);

        await rightUhkOperations.setVariable(UsbVariables.testSwitches, 1);
        await leftUhkOperations.setVariable(UsbVariables.testSwitches, 1);
    }
    finally {
        leftUhkDevice?.close();
        rightUhkDevice?.close();
    }

} catch (error) {
    await errorHandler(error);
}

interface OperationResult {
    uhkDeviceProduct: UhkDeviceProduct;
    error?: any;
}

async function getHidDevices() {
    const rightHidDevice = await getCurrenUhk80RightHID();
    if (!rightHidDevice) {
        console.error('Cannot find UHK 80 right half!');
        process.exit(1);
    }

    const leftHidDevice = await getCurrenUhk80LeftHID();
    if (!leftHidDevice) {
        console.error('Cannot find UHK 80 left half!');
        process.exit(1);
    }

    return {
        rightHidDevice,
        leftHidDevice,
    };
}

function assertOperationResults(operationResults: OperationResult[], errorMessage: string) {
    let hasError = false;
    for (const operationResult of operationResults) {
        if (operationResult.error) {
            hasError = true;
            console.error(errorMessage, operationResult.uhkDeviceProduct.logName);
            console.error(operationResult.error);
            console.error('\n');
        }
    }

    if (hasError) {
        process.exit(1);
    }
}

async function upgradeFirmware(uhkDeviceProduct: UhkDeviceProduct, hidDevice: Device, packageJson: FirmwareJson): Promise<OperationResult> {
    const result: OperationResult = {
        uhkDeviceProduct
    };

    let uhkHidDevice: UhkHidDevice;
    try {
        const deviceFirmwarePath = getDeviceFirmwarePath(uhkDeviceProduct, packageJson);
        uhkHidDevice = new UhkHidDevice(logger, {}, rootDir, hidDevice);
        const uhkOperations = new UhkOperations(logger, uhkHidDevice);
        await uhkOperations.updateDeviceFirmware(deviceFirmwarePath, uhkDeviceProduct);
        await waitForUhkDeviceConnected(uhkDeviceProduct);
    }
    catch (error) {
        result.error = error;
    }
    finally {
        uhkHidDevice?.close();
    }

    return result;
}

async function writeHardwareConfig(uhkDeviceProduct: UhkDeviceProduct, hidDevice: Device, layout: string ): Promise<OperationResult> {
    const result: OperationResult = {
        uhkDeviceProduct
    };

    let uhkHidDevice: UhkHidDevice;

    try {
        uhkHidDevice = new UhkHidDevice(logger, {}, rootDir, hidDevice);
        const uhkOperations = new UhkOperations(logger, uhkHidDevice);
        await uhkOperations.saveHardwareConfiguration(layout === 'iso', uhkDeviceProduct.id, argv.setSerialNumber);
    }
    catch (error) {
        result.error = error;
    }
    finally {
        uhkHidDevice?.close();
    }


    return result;
}
