import {
    Buffer,
    ConfigSizesInfo,
    HardwareConfiguration,
    LogService,
    ModuleVersionInfo,
    RightModuleInfo,
    UhkBuffer
} from 'uhk-common';
import { DataOption, KBoot, Properties, UsbPeripheral } from 'kboot';

import {
    ConfigBufferId,
    Constants,
    EepromOperation,
    EnumerationModes,
    EnumerationNameToProductId,
    KbootCommands,
    ModulePropertyId,
    ModuleSlotToI2cAddress,
    ModuleSlotToId,
    UsbVariables
} from './constants';
import * as fs from 'fs';
import * as os from 'os';
import { UhkBlhost } from './uhk-blhost';
import { UhkHidDevice } from './uhk-hid-device';
import { readBootloaderFirmwareFromHexFileAsync, snooze, waitForDevice } from './util';
import { convertBufferToIntArray, DevicePropertyIds, getTransferBuffers, UsbCommand } from '../index';
import { LoadConfigurationsResult, DebugInfo, I2cBaudRate, Duration, I2cErrorBuffer } from './models';
import { convertMsToDuration, convertSlaveI2cErrorBuffer } from './utils';

export class UhkOperations {
    constructor(private logService: LogService,
                private blhost: UhkBlhost,
                private device: UhkHidDevice) {
    }

    public async updateRightFirmwareWithBlhost(firmwarePath: string): Promise<void> {
        this.logService.misc(`[UhkOperations] Operating system: ${os.type()} ${os.release()} ${os.arch()}`);
        this.logService.misc('[UhkOperations] Start flashing right firmware');
        const prefix = [`--usb 0x1d50,0x${EnumerationNameToProductId.bootloader.toString(16)}`];

        await this.device.reenumerate(EnumerationModes.Bootloader);
        this.device.close();
        await this.blhost.runBlhostCommand([...prefix, 'flash-security-disable', '0403020108070605']);
        await this.blhost.runBlhostCommand([...prefix, 'flash-erase-region', '0xc000', '475136']);
        await this.blhost.runBlhostCommand([...prefix, 'flash-image', `"${firmwarePath}"`]);
        await this.blhost.runBlhostCommand([...prefix, 'reset']);
        this.logService.misc('[UhkOperations] Right firmware successfully flashed');
    }

    public async updateLeftModuleWithBlhost(firmwarePath: string): Promise<void> {
        this.logService.misc('[UhkOperations] Start flashing left module firmware');

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
            const msg = '[UhkOperations] Couldn\'t connect to the left keyboard half.';
            this.logService.error(msg);
            throw new Error(msg);
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

        this.logService.misc('[UhkOperations] Left firmware successfully flashed');
        this.logService.misc('[UhkOperations] Both left and right firmwares successfully flashed');
    }

    public async updateRightFirmwareWithKboot(firmwarePath: string): Promise<void> {
        this.logService.misc(`[UhkOperations] Operating system: ${os.type()} ${os.release()} ${os.arch()}`);
        this.logService.misc('[UhkOperations] Start flashing right firmware');

        this.logService.misc('[UhkOperations] Reenumerate bootloader');
        await this.device.reenumerate(EnumerationModes.Bootloader);
        this.device.close();
        const kboot = new KBoot(new UsbPeripheral({ productId: Constants.BOOTLOADER_ID, vendorId: Constants.VENDOR_ID }));
        this.logService.misc('[UhkOperations] Waiting for bootloader');
        await waitForDevice(Constants.VENDOR_ID, Constants.BOOTLOADER_ID);
        this.logService.misc('[UhkOperations] Flash security disable');
        await kboot.flashSecurityDisable([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
        this.logService.misc('[UhkOperations] Flash erase region');
        await kboot.flashEraseRegion(0xc000, 475136);

        this.logService.misc('[UhkOperations] Read RIGHT firmware from file');
        const bootloaderMemoryMap = await readBootloaderFirmwareFromHexFileAsync(firmwarePath);
        this.logService.misc('[UhkOperations] Write memory');
        for (const [startAddress, data] of bootloaderMemoryMap.entries()) {
            const dataOption: DataOption = {
                startAddress,
                data
            };

            await kboot.writeMemory(dataOption);
        }

        this.logService.misc('[UhkOperations] Reset bootloader');
        await kboot.reset();
        this.logService.misc('[UhkOperations] Close communication channels');
        kboot.close();
        this.logService.misc('[UhkOperations] Right firmware successfully flashed');
    }

    public async updateLeftModuleWithKboot(firmwarePath: string): Promise<void> {
        this.logService.misc('[UhkOperations] Start flashing left module firmware');

        const i2cAddressOfLeftModule = Number.parseInt(ModuleSlotToI2cAddress.leftHalf, 16);
        await this.device.reenumerate(EnumerationModes.NormalKeyboard);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.ping, 100);
        await snooze(1000);
        await this.device.jumpToBootloaderModule(ModuleSlotToId.leftHalf);
        this.device.close();

        const leftModuleBricked = await this.waitForKbootIdle();
        if (!leftModuleBricked) {
            const msg = '[UhkOperations] Couldn\'t connect to the left keyboard half.';
            this.logService.error(msg);
            throw new Error(msg);
        }

        await this.device.reenumerate(EnumerationModes.Buspal);
        this.device.close();
        this.logService.misc('[UhkOperations] Waiting for buspal');
        await waitForDevice(Constants.VENDOR_ID, EnumerationNameToProductId.buspal);
        let tryCount = 0;
        const usbPeripheral = new UsbPeripheral({ productId: EnumerationNameToProductId.buspal, vendorId: Constants.VENDOR_ID });
        const kboot = new KBoot(usbPeripheral);
        while (true) {
            try {
                this.logService.misc('[UhkOperations] Try to connect to the LEFT keyboard');
                await kboot.configureI2c(i2cAddressOfLeftModule);
                await kboot.getProperty(Properties.BootloaderVersion);
                break;
            } catch {
                if (tryCount > 100) {
                    throw new Error('Can not connect to the LEFT keyboard');
                }
                await snooze(2000);
            }
            tryCount++;
        }

        // https://github.com/node-hid/node-hid/issues/230
        this.logService.misc('[UhkOperations] Waiting 1s to prevent node-hid race condition');
        await snooze(1000);

        this.logService.misc('[UhkOperations] Flash erase all on LEFT keyboard');
        await kboot.configureI2c(i2cAddressOfLeftModule);
        await kboot.flashEraseAllUnsecure();

        this.logService.misc('[UhkOperations] Read LEFT firmware from file');
        const configData = fs.readFileSync(firmwarePath);

        this.logService.misc('[UhkOperations] Write memory');
        await kboot.configureI2c(i2cAddressOfLeftModule);
        await kboot.writeMemory({ startAddress: 0, data: configData });

        this.logService.misc('[UhkOperations] Reset LEFT keyboard');
        await kboot.reset();

        this.logService.misc('[UhkOperations] Close communication channels');
        kboot.close();

        await snooze(1000);
        await this.device.reenumerate(EnumerationModes.NormalKeyboard);
        this.device.close();
        this.logService.misc('[UhkOperations] Waiting for normalKeyboard');
        await waitForDevice(Constants.VENDOR_ID, EnumerationNameToProductId.normalKeyboard);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.reset, 100);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(ModuleSlotToI2cAddress.leftHalf, KbootCommands.idle);
        this.device.close();

        this.logService.misc('[UhkOperations] Left firmware successfully flashed');
        this.logService.misc('[UhkOperations] Both left and right firmwares successfully flashed');
    }

    /**
     * Return with the actual UserConfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfigurations(): Promise<LoadConfigurationsResult> {
        try {
            await this.waitUntilKeyboardBusy();
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
            this.logService.usb(`[DeviceOperation] USB[T]: Read ${configName} size from keyboard`);
            let configSize = await this.getConfigSizeFromKeyboard(configBufferId);
            const originalConfigSize = configSize;
            this.logService.usb(`[DeviceOperation] getConfigSize() configSize: ${configSize}`);
            const chunkSize = 63;
            let offset = 0;
            let configBuffer = Buffer.alloc(0);
            let firstRead = true;

            this.logService.usb(`[DeviceOperation] USB[T]: Read ${configName} from keyboard`);
            while (offset < configSize) {
                const chunkSizeToRead = Math.min(chunkSize, configSize - offset);
                const writeBuffer = Buffer.from(
                    [UsbCommand.ReadConfig, configBufferId, chunkSizeToRead, offset & 0xff, offset >> 8]);
                const readBuffer = await this.device.write(writeBuffer);
                configBuffer = Buffer.concat([configBuffer, Buffer.from(readBuffer.slice(1, chunkSizeToRead + 1))]);
                offset += chunkSizeToRead;

                if (firstRead && configBufferId !== ConfigBufferId.hardwareConfig) {
                    firstRead = false;
                    configSize = readBuffer[7] + (readBuffer[8] << 8);
                    this.logService.misc(`[DeviceOperation] userConfigSize: ${configSize}`);
                    if (originalConfigSize < configSize) {
                        this.logService.misc(`[DeviceOperation] userConfigSize should never be larger than getConfigSize()! ` +
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
        const configSizes = await this.getConfigSizesFromKeyboard();
        const isHardwareConfig = configBufferId === ConfigBufferId.hardwareConfig;
        const configSize = isHardwareConfig ? configSizes.hardwareConfig : configSizes.userConfig;
        const configString = isHardwareConfig ? 'Hardware' : 'User';
        this.logService.misc(`[DeviceOperation] ${configString} config size:`, configSize);
        return configSize;
    }

    public async getConfigSizesFromKeyboard(): Promise<ConfigSizesInfo> {
        const buffer = await this.device.write(Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.ConfigSizes]));
        this.device.close();

        return {
            hardwareConfig: buffer[1] + (buffer[2] << 8),
            userConfig: buffer[3] + (buffer[4] << 8)
        };
    }

    public async saveUserConfiguration(buffer: Buffer): Promise<void> {
        try {
            this.logService.usb('[DeviceOperation] USB[T]: Write user configuration to keyboard');
            await this.sendConfigToKeyboard(buffer, true);
            await this.applyConfiguration();
            this.logService.usb('[DeviceOperation] USB[T]: Write user configuration to EEPROM');
            await this.writeConfigToEeprom(ConfigBufferId.validatedUserConfig);
        } catch (error) {
            this.logService.error('[DeviceOperation] Transferring error', error);
            throw error;
        } finally {
            this.device.close();
        }
    }

    public async saveHardwareConfiguration(isIso: boolean): Promise<void> {
        const hardwareConfig = new HardwareConfiguration();

        hardwareConfig.signature = 'UHK';
        hardwareConfig.majorVersion = 1;
        hardwareConfig.minorVersion = 0;
        hardwareConfig.patchVersion = 0;
        hardwareConfig.brandId = 0;
        hardwareConfig.deviceId = 1;
        hardwareConfig.uniqueId = Math.floor(2 ** 32 * Math.random());
        hardwareConfig.isVendorModeOn = false;
        hardwareConfig.isIso = isIso;

        const hardwareBuffer = new UhkBuffer();
        hardwareConfig.toBinary(hardwareBuffer);
        const buffer = hardwareBuffer.getBufferContent();

        await this.sendConfigToKeyboard(buffer, false);
        await this.writeConfigToEeprom(ConfigBufferId.hardwareConfig);
    }

    public async writeConfigToEeprom(configBufferId: ConfigBufferId): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Write Config to Eeprom');
        await this.device.write(Buffer.from([UsbCommand.LaunchEepromTransfer, EepromOperation.write, configBufferId]));
        await this.waitUntilKeyboardBusy();
    }

    public async enableUsbStackTest(): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Enable USB Stack test');
        await this.device.write(Buffer.from([UsbCommand.SetVariable, UsbVariables.testUsbStack, 1]));
        await this.waitUntilKeyboardBusy();
    }

    public async waitUntilKeyboardBusy(): Promise<void> {
        while (true) {
            const deviceState = await this.device.getDeviceState();
            if (!deviceState.isEepromBusy) {
                break;
            }
            this.logService.misc('Keyboard is busy, wait...');
            await snooze(200);
        }
    }

    public async waitForKbootIdle(): Promise<boolean> {
        const timeoutTime = new Date(new Date().getTime() + 30000);

        while (new Date() < timeoutTime) {
            const buffer = await this.device.write(Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.CurrentKbootCommand]));
            this.device.close();

            if (buffer[1] === 0) {
                return true;
            }

            // tslint:disable-next-line: max-line-length
            this.logService.misc('[DeviceOperation] Cannot ping the bootloader. Please remove the bridge cable, and keep reconnecting the left keyboard half until you see this message.');

            await snooze(1000);
        }

        return false;
    }

    public async getModuleVersionInfo(module: ModuleSlotToId): Promise<ModuleVersionInfo> {
        this.logService.misc(`[DeviceOperation] Read ${module} version information`);
        this.logService.usb('[DeviceOperation] USB[T]: Read module version information');

        const command = Buffer.from([
            UsbCommand.GetModuleProperty,
            module,
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

    public async getLeftModuleVersionInfo(): Promise<ModuleVersionInfo> {
        try {
            return await this.getModuleVersionInfo(ModuleSlotToId.leftHalf);
        } catch (error) {
            this.logService.error('[DeviceOperation] Could not read left module version information', error);
        }

        return {
            moduleProtocolVersion: '',
            firmwareVersion: ''
        };
    }

    public async getRightModuleVersionInfo(): Promise<RightModuleInfo> {
        this.logService.usb('[DeviceOperation] USB[T]: Read right module version information');

        const command = Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.ProtocolVersions]);
        const buffer = await this.device.write(command);
        const uhkBuffer = UhkBuffer.fromArray(convertBufferToIntArray(buffer));
        // skip the first byte
        uhkBuffer.readUInt8();

        return {
            firmwareVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            deviceProtocolVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            moduleProtocolVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            userConfigVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            hardwareConfigVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`
        };
    }

    public async setLedPwmBrightness(percent: number): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Set LED PWM Brightness');

        const command = Buffer.from([UsbCommand.SetLedPwmBrightness, percent]);
        await this.device.write(command);
    }

    public async applyConfiguration(): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Apply user configuration to keyboard');
        const applyBuffer = Buffer.from([UsbCommand.ApplyConfig]);
        await this.device.write(applyBuffer);
    }

    public async setTestLedsState(on: boolean): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Set test LEDs state');
        const buffer = Buffer.from([UsbCommand.SetTestLed, on ? 1 : 0]);
        await this.device.write(buffer);
    }

    public async launchEepromTransfer(operation: EepromOperation, bufferId: ConfigBufferId): Promise<Buffer> {
        this.logService.usb('[DeviceOperation] USB[T]: Launch EEPORM transfer');
        const buffer = Buffer.from([UsbCommand.LaunchEepromTransfer, operation, bufferId]);

        return this.device.write(buffer);
    }

    public async eraseHardwareConfig(): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Erase hardware configuration');
        const buffer = Buffer.from(Array(64).fill(0xff));
        await this.sendConfigToKeyboard(buffer, false);
        await this.writeConfigToEeprom(ConfigBufferId.hardwareConfig);
    }

    public async eraseUserConfig(): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Erase user configuration');
        const buffer = Buffer.from(Array(2 ** 15 - 64).fill(0xff));
        await this.sendConfigToKeyboard(buffer, false);
        await this.writeConfigToEeprom(ConfigBufferId.stagingUserConfig);
    }

    public async switchKeymap(keymapAbbreviation: string): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Switch keymap');
        const keymapAbbreviationAscii = keymapAbbreviation.split('').map(char => char.charCodeAt(0));
        const buffer = Buffer.from([UsbCommand.SwitchKeymap, keymapAbbreviationAscii.length, keymapAbbreviationAscii]);

        await this.device.write(buffer);
    }

    public async getAdcValue(): Promise<Buffer> {
        this.logService.usb('[DeviceOperation] USB[T]: get ADC Value');
        const buffer = Buffer.from([UsbCommand.GetAdcValue]);

        return this.device.write(buffer);
    }

    public async getDebugInfo(): Promise<DebugInfo> {
        this.logService.usb('[DeviceOperation] USB[T]: get Debug info');
        const buffer = Buffer.from([UsbCommand.GetDebugBuffer]);

        const responseBuffer = await this.device.write(buffer);

        return {
            i2cWatchdog: responseBuffer.readUInt32LE(1),
            i2cSlaveSchedulerCounter: responseBuffer.readUInt32LE(5),
            i2cWatchdogWatchCounter: responseBuffer.readUInt32LE(9),
            i2cWatchdogRecoveryCounter: responseBuffer.readUInt32LE(13),
            keyScannerCounter: responseBuffer.readUInt32LE(17),
            usbReportUpdateCounter: responseBuffer.readUInt32LE(21),
            currentTime: responseBuffer.readUInt32LE(25),
            usbGenericHidActionCounter: responseBuffer.readUInt32LE(29),
            usbBasicKeyboardActionCounter: responseBuffer.readUInt32LE(33),
            usbMediaKeyboardActionCounter: responseBuffer.readUInt32LE(37),
            usbSystemKeyboardActionCounter: responseBuffer.readUInt32LE(41),
            usbMouseActionCounter: responseBuffer.readUInt32LE(45)
        };
    }

    public async getI2CBaudRate(): Promise<I2cBaudRate> {
        this.logService.usb('[DeviceOperation] USB[T]: get I2C Baud rate');
        const buffer = Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.I2cBaudRate]);

        const responseBuffer = await this.device.write(buffer);

        return {
            requestedBaudRate: responseBuffer.readUInt32LE(2),
            actualBaudRate: responseBuffer.readUInt32LE(6),
            i2c0F: responseBuffer[1].toString(2).padStart(8, '0')
        };
    }

    public async getUptime(): Promise<Duration> {
        this.logService.usb('[DeviceOperation] USB[T]: get uptime');
        const buffer = Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.Uptime]);
        const responseBuffer = await this.device.write(buffer);

        return convertMsToDuration(responseBuffer.readUInt32LE(1));
    }

    public async getI2cSlaveErrors(slaveId: number): Promise<I2cErrorBuffer> {
        this.logService.usb('[DeviceOperation] USB[T]: get I2C Slave errors');
        const buffer = Buffer.from([UsbCommand.GetSlaveI2cErrors, slaveId]);
        const responseBuffer = await this.device.write(buffer);

        return convertSlaveI2cErrorBuffer(responseBuffer, slaveId);
    }

    public async getVariable(variableId: UsbVariables): Promise<number> {
        this.logService.usb('[DeviceOperation] USB[T]: get variable');
        const buffer = Buffer.from([UsbCommand.GetVariable, variableId]);
        const responseBuffer = await this.device.write(buffer);

        return responseBuffer[1];
    }
    /**
     * IpcMain handler. Send the UserConfiguration to the UHK Device and send a response with the result.
     * @param {Buffer} buffer - UserConfiguration buffer
     * @param {Boolean} isUserConfiguration - User or Hardware configuration
     * @returns {Promise<void>}
     * @private
     */
    private async sendConfigToKeyboard(buffer: Buffer, isUserConfiguration): Promise<void> {
        const command = isUserConfiguration
            ? UsbCommand.WriteStagingUserConfig
            : UsbCommand.WriteHardwareConfig;

        const fragments = getTransferBuffers(command, buffer);
        for (const fragment of fragments) {
            await this.device.write(fragment);
        }
    }
}
