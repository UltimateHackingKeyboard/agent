import {
    UhkHidDevice,
    EnumerationModes,
    getDeviceEnumerateProductId,
    getCurrentUhkDeviceProduct
} from 'uhk-usb';
import { CommandLineArgs } from 'uhk-common';

import { ElectronLogService } from '../services/logger.service';
import { devices } from 'node-hid';

export interface ReenumerateAndExitOptions {
    logger: ElectronLogService;
    uhkHidDevice: UhkHidDevice;
    commandLineArgs: CommandLineArgs;
}

export async function reenumerateAndExit(options: ReenumerateAndExitOptions): Promise<void> {
    const arg = options.commandLineArgs['reenumerate-and-exit'];
    options.logger.misc(`[reenumerateAndExit] Command line argument: ${arg}`);

    options.logger.misc('[reenumerateAndExit] list available devices');
    // TODO: pass vendor id ????
    options.uhkHidDevice.listAvailableDevices(devices());

    const startTime = new Date();
    const reenumerationOption = parseReenumerateAndExitArg(arg);
    const uhkDeviceProduct = getCurrentUhkDeviceProduct();
    const enumerationProduct = getDeviceEnumerateProductId(uhkDeviceProduct, reenumerationOption.mode);
    await options.uhkHidDevice.reenumerate({
        enumerationMode: reenumerationOption.mode,
        vendorId: uhkDeviceProduct.vendorId,
        productId: enumerationProduct,
        timeout: reenumerationOption.timeout
    });

    options.logger.misc('[reenumerateAndExit] Reenumeration success');
    options.logger.misc('[reenumerateAndExit] Monitoring device list changes');

    const waitTime = reenumerationOption.timeout + 10000;

    while (new Date().getTime() - startTime.getTime() < waitTime) {
        // TODO: pass vendor id ????
        options.uhkHidDevice.listAvailableDevices(devices());
    }
}

interface ReenumerationOption {
    timeout: number;
    mode: EnumerationModes;
}

function parseReenumerateAndExitArg(arg: string): ReenumerationOption {
    const split = arg.split(',');

    if (split.length !== 2) {
        throw new Error('Argument must be in "(bootloader|buspal),timeout" format');
    }

    return {
        mode: parseEnumerationMode(split[0]),
        timeout: parseEnumerationTimeout(split[1])
    };
}

function parseEnumerationMode(mode: string): EnumerationModes {
    switch (mode) {
        case 'bootloader':
            return EnumerationModes.Bootloader;

        case 'buspal':
            return EnumerationModes.Buspal;

        default:
            throw new Error(`Unknown enumeration mode: ${mode}`);
    }
}

function parseEnumerationTimeout(timeout: string): number {
    const numValue = Number.parseInt(timeout);

    if (Number.isNaN(numValue)) {
        throw new Error(`Invalid timeout value ${timeout}`);
    }

    return numValue;
}
