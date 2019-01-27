import { execSync } from 'child_process';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as MemoryMap from 'nrf-intel-hex';

export enum UhkReenumerationModes {
    Bootloader = 'bootloader',
    Buspal = 'buspal',
    NormalKeyboard = 'normalKeyboard',
    CompatibleKeyboard = 'compatibleKeyboard'
}

const USB_SCRIPTS_DIR = join(__dirname, '../../../usb');
export const reenumerate = (mode: UhkReenumerationModes): void => {
    const reenumerateScriptFile = join(USB_SCRIPTS_DIR, 'reenumerate.js');
    const command = [reenumerateScriptFile, mode.toString()].join(' ');

    execSync(command, {
        cwd: USB_SCRIPTS_DIR,
        stdio: [0, 1, 2]
    });
};

export const readBootloaderFirmwareFromHexFile = (): Map<any, any> => {
    const hexFilePath = join(__dirname, '../../../../tmp/packages/firmware/devices/uhk60-right/firmware.hex');
    const fileContent = readFileSync(hexFilePath, { encoding: 'utf8' });
    const memoryMap = MemoryMap.fromHex(fileContent);

    return memoryMap;
};
