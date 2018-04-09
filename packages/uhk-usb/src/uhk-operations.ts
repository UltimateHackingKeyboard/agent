import { HardwareModuleInfo, LogService, UhkBuffer } from 'uhk-common';
import {
    EnumerationModes,
    EnumerationNameToProductId,
    KbootCommands,
    ModulePropertyId,
    ModuleSlotToI2cAddress,
    ModuleSlotToId
} from './constants';
import * as path from 'path';
import * as fs from 'fs';
import { UhkBlhost } from './uhk-blhost';
import { UhkHidDevice } from './uhk-hid-device';
import { snooze } from './util';
import {
    convertBufferToIntArray,
    getTransferBuffers,
    DevicePropertyIds,
    UsbCommand,
    ConfigBufferId
} from '../index';
import { LoadConfigurationsResult } from './models/load-configurations-result';

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
        this.logService.debug('[UhkOperations] Right firmware successfully flashed');
    }

    public async updateLeftModule(firmwarePath = this.getLeftModuleFirmwarePath()) {
        this.logService.debug('[UhkOperations] Start flashing left module firmware');

        const prefix = [`--usb 0x1d50,0x${EnumerationNameToProductId.buspal.toString(16)}`];
        const buspalPrefix = [...prefix, `--buspal i2c,${ModuleSlotToI2cAddress.leftHalf}`];

        await this.device.reenumerate(EnumerationModes.NormalKeyboard);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.ping, 100);
        await snooze(1000);
        await this.device.jumpToBootloaderModule(ModuleSlotToId.leftHalf);
        this.device.close();

        const leftModuleBricked = await this.waitForKbootIdle();
        if (!leftModuleBricked) {
            this.logService.error('[UhkOperations] Couldn\'t connect to the left keyboard half.');
            return;
        }

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
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.reset, 100);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.idle);
        this.device.close();

        this.logService.debug('[UhkOperations] Left firmware successfully flashed');
        this.logService.debug('[UhkOperations] Both left and right firmwares successfully flashed');
    }

    /**
     * Return with the actual UserConfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfigurations(): Promise<LoadConfigurationsResult> {
        try {
            await this.device.waitUntilKeyboardBusy();
            const userConfiguration = await this.loadConfiguration(ConfigBufferId.validatedUserConfig);
            const hardwareConfiguration = await this.loadConfiguration(ConfigBufferId.hardwareConfig);

            return {
                userConfiguration,
                hardwareConfiguration
            };
        } finally {
            this.device.close();
        }
    }

    /**
     * Return with the actual user / hardware fonfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfiguration(configBufferId: ConfigBufferId): Promise<string> {
        const configBufferIdToName = ['HardwareConfig', 'StagingUserConfig', 'ValidatedUserConfig'];
        const configName = configBufferIdToName[configBufferId];

        try {
            this.logService.debug(`[DeviceOperation] USB[T]: Read ${configName} size from keyboard`);
            let configSize = await this.getConfigSizeFromKeyboard(configBufferId);
            const originalConfigSize = configSize;
            this.logService.debug(`[DeviceOperation] getConfigSize() configSize: ${configSize}`);
            const chunkSize = 63;
            let offset = 0;
            let configBuffer = new Buffer(0);
            let firstRead = true;

            this.logService.debug(`[DeviceOperation] USB[T]: Read ${configName} from keyboard`);
            while (offset < configSize) {
                const chunkSizeToRead = Math.min(chunkSize, configSize - offset);
                const writeBuffer = Buffer.from(
                    [UsbCommand.ReadConfig, configBufferId, chunkSizeToRead, offset & 0xff, offset >> 8]);
                const readBuffer = await this.device.write(writeBuffer);
                configBuffer = Buffer.concat([configBuffer, new Buffer(readBuffer.slice(1, chunkSizeToRead + 1))]);
                offset += chunkSizeToRead;

                if (firstRead && configBufferId !== ConfigBufferId.hardwareConfig) {
                    firstRead = false;
                    configSize = readBuffer[7] + (readBuffer[8] << 8);
                    this.logService.debug(`[DeviceOperation] userConfigSize: ${configSize}`);
                    if (originalConfigSize < configSize) {
                        this.logService.debug(`[DeviceOperation] userConfigSize should never be larger than getConfigSize()! ` +
                            `Overriding configSize with getConfigSize()`);
                        configSize = originalConfigSize;
                    }
                }
            }
            const response = convertBufferToIntArray(configBuffer);

            return Promise.resolve(JSON.stringify(response));
        } catch (error) {
            const errMsg = `[DeviceOperation] ${configName} from eeprom error`;
            this.logService.error(errMsg, error);
            throw new Error(errMsg);
        }
    }

    /**
     * Return the user / hardware configuration size from the UHK Device
     * @returns {Promise<number>}
     */
    public async getConfigSizeFromKeyboard(configBufferId: ConfigBufferId): Promise<number> {
        const buffer = await this.device.write(new Buffer([UsbCommand.GetProperty, DevicePropertyIds.ConfigSizes]));
        this.device.close();
        const hardwareConfigSize = buffer[1] + (buffer[2] << 8);
        const userConfigSize = buffer[3] + (buffer[4] << 8);
        const isHardwareConfig = configBufferId === ConfigBufferId.hardwareConfig;
        const configSize = isHardwareConfig ? hardwareConfigSize : userConfigSize;
        const configString = isHardwareConfig ? 'Hardware' : 'User';
        this.logService.debug(`[DeviceOperation] ${configString} config size:`, configSize);
        return configSize;
    }

    public async saveUserConfiguration(buffer: Buffer): Promise<void> {
        try {
            this.logService.debug('[DeviceOperation] USB[T]: Write user configuration to keyboard');
            await this.sendUserConfigToKeyboard(buffer);
            this.logService.debug('[DeviceOperation] USB[T]: Write user configuration to EEPROM');
            await this.device.writeConfigToEeprom(ConfigBufferId.validatedUserConfig);
        }
        catch (error) {
            this.logService.error('[DeviceOperation] Transferring error', error);
            throw error;
        } finally {
            this.device.close();
        }
    }

    public async waitForKbootIdle(): Promise<boolean> {
        const timeoutTime = new Date(new Date().getTime() + 30000);

        while (new Date() < timeoutTime) {
            const buffer = await this.device.write(new Buffer([UsbCommand.GetProperty, DevicePropertyIds.CurrentKbootCommand]));
            this.device.close();

            if (buffer[1] === 0) {
                return true;
            }

            // tslint:disable-next-line: max-line-length
            this.logService.info('[DeviceOperation] Cannot ping the bootloader. Please reconnect the left keyboard half. It probably needs several tries, so keep reconnecting until you see this message.');

            await snooze(1000);
        }

        return false;
    }

    public async getLeftModuleVersionInfo(): Promise<HardwareModuleInfo> {
        try {
            this.logService.debug('[DeviceOperation] USB[T]: Read left module version information');

            const command = new Buffer([
                UsbCommand.GetModuleProperty,
                ModuleSlotToId.leftHalf,
                ModulePropertyId.protocolVersions
            ]);

            const buffer = await this.device.write(command);
            const uhkBuffer = UhkBuffer.fromArray(convertBufferToIntArray(buffer));
            // skip the first 2 byte
            uhkBuffer.readUInt16();

            return {
                moduleProtocolVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
                firmwareVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`
            };
        }
        catch (error) {
            this.logService.error('[DeviceOperation] Could not read left module version information', error);
        }

        return {
            moduleProtocolVersion: '',
            firmwareVersion: ''
        };
    }

    public async getRightModuleVersionInfo(): Promise<HardwareModuleInfo> {
        this.logService.debug('[DeviceOperation] USB[T]: Read right module version information');

        const command = new Buffer([UsbCommand.GetProperty, DevicePropertyIds.ProtocolVersions]);
        const buffer = await this.device.write(command);
        const uhkBuffer = UhkBuffer.fromArray(convertBufferToIntArray(buffer));
        // skip the first byte
        uhkBuffer.readUInt8();

        return {
            firmwareVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`
        };
    }

    /**
     * IpcMain handler. Send the UserConfiguration to the UHK Device and send a response with the result.
     * @param {Buffer} buffer - UserConfiguration buffer
     * @returns {Promise<void>}
     * @private
     */
    private async sendUserConfigToKeyboard(buffer: Buffer): Promise<void> {
        const fragments = getTransferBuffers(UsbCommand.WriteStagingUserConfig, buffer);
        for (const fragment of fragments) {
            await this.device.write(fragment);
        }
        this.logService.debug('[DeviceOperation] USB[T]: Apply user configuration to keyboard');
        const applyBuffer = new Buffer([UsbCommand.ApplyConfig]);
        await this.device.write(applyBuffer);
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
