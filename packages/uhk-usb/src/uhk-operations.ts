import { LogService } from 'uhk-common';
import { EnumerationModes, EnumerationNameToProductId, KbootCommands, ModuleSlotToI2cAddress, ModuleSlotToId } from './constants';
import * as path from 'path';
import * as fs from 'fs';
import { UhkBlhost } from './uhk-blhost';
import { UhkHidDevice } from './uhk-hid-device';
import { snooze } from './util';

export class UhkOperations {
    constructor(private logService: LogService,
                private blhost: UhkBlhost,
                private device: UhkHidDevice,
                private rootDir: string) {
    }

    public async updateRightFirmware(firmwarePath = this.getFirmwarePath()) {
        this.logService.debug('[UhkOperations] Start flashing right firmware');
        const prefix = [`--usb 0x1d50,0x${EnumerationNameToProductId.bootloader.toString(16)}`];

        await this.device.reenumerate(EnumerationModes.Bootloader);
        this.device.close();
        await this.blhost.runBlhostCommand([...prefix, 'flash-security-disable', '0403020108070605']);
        await this.blhost.runBlhostCommand([...prefix, 'flash-erase-region', '0xc000', '475136']);
        await this.blhost.runBlhostCommand([...prefix, 'flash-image', `"${firmwarePath}"`]);
        await this.blhost.runBlhostCommand([...prefix, 'reset']);
        this.logService.debug('[UhkOperations] End flashing right firmware');
    }

    public async updateLeftModule(firmwarePath = this.getLeftModuleFirmwarePath()) {
        this.logService.debug('[UhkOperations] Start flashing left module firmware');

        const prefix = [`--usb 0x1d50,0x${EnumerationNameToProductId.buspal.toString(16)}`];
        const buspalPrefix = [...prefix, `--buspal i2c,${ModuleSlotToI2cAddress.leftHalf},100k`];

        await this.device.reenumerate(EnumerationModes.NormalKeyboard);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.ping, 10);
        await snooze(1000);
        await this.device.jumpToBootloaderModule(ModuleSlotToId.leftHalf);
        this.device.close();
        await this.device.reenumerate(EnumerationModes.Buspal);
        this.device.close();
        await this.blhost.runBlhostCommandRetry([...buspalPrefix, 'get-property', '1']);
        await this.blhost.runBlhostCommand([...buspalPrefix, 'flash-erase-all-unsecure']);
        await this.blhost.runBlhostCommand([...buspalPrefix, 'write-memory', '0x0', `"${firmwarePath}"`]);
        await this.blhost.runBlhostCommand([...prefix, 'reset']);
        await snooze(1000);
        await this.device.reenumerate(EnumerationModes.NormalKeyboard);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.reset, 3);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.idle);
        this.device.close();

        this.logService.debug('[UhkOperations] End flashing left module firmware');
    }

    private getFirmwarePath(): string {
        const firmware = path.join(this.rootDir, 'packages/firmware/devices/uhk60-right/firmware.hex');

        if (fs.existsSync(firmware)) {
            return firmware;
        }

        throw new Error(`Could not found firmware ${firmware}`);
    }

    private getLeftModuleFirmwarePath(): string {
        const firmware = path.join(this.rootDir, 'packages/firmware/modules/uhk60-left.bin');

        if (fs.existsSync(firmware)) {
            return firmware;
        }

        throw new Error(`Could not found firmware ${firmware}`);
    }
}
