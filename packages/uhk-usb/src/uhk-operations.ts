import { McuManager, SerialPeripheral } from '@uhk/mcumgr';
import * as fs from 'fs';
import { DataOption, KBoot, Properties, UsbPeripheral } from 'kboot';
import {
    ALL_UHK_DEVICES,
    BleAddressPair,
    Buffer,
    ConfigSizesInfo,
    convertBleAddressArrayToString,
    DeviceVersionInformation,
    FIRMWARE_UPGRADE_METHODS,
    FirmwareRepoInfo,
    getSlotIdName,
    HardwareConfiguration,
    isDeviceProtocolSupportFirmwareChecksum,
    isDeviceProtocolSupportGitInfo,
    LEFT_HALF_MODULE,
    LogService,
    ModuleSlotToId,
    ModuleVersionInfo,
    UhkBuffer,
    UhkDeviceProduct,
    UhkModule,
    UNKNOWN_DEVICE,
} from 'uhk-common';
import { promisify } from 'util';
import {
    ConfigBufferId,
    DevicePropertyIds,
    EepromOperation,
    EnumerationModes,
    KbootCommands,
    MAX_USB_PAYLOAD_SIZE,
    ModulePropertyId,
    PAIRING_STATUS_TEXT,
    PairIds,
    PairingStatuses,
    UsbCommand,
    UsbVariables
} from './constants.js';
import {
    DebugInfo,
    Duration,
    I2cBaudRate,
    I2cErrorBuffer,
    LoadConfigurationsResult,
} from './models/index.js';

import { UhkHidDevice } from './uhk-hid-device.js';
import {
    convertBufferToIntArray,
    getTransferBuffers,
    readBootloaderFirmwareFromHexFileAsync,
    waitForDevice
} from './util.js';
import { convertMsToDuration, convertSlaveI2cErrorBuffer, snooze, waitUntil} from './utils/index.js';
import { normalizeStatusBuffer } from './utils/normalize-status-buffer.js';
import readUhkResponseAs0EndString from './utils/read-uhk-response-as-0-end-string.js';

const existsAsync = promisify(fs.exists);

interface GetModulePropertyArguments {
    module: ModuleSlotToId,
    property: ModulePropertyId
}

export class UhkOperations {
    constructor(private logService: LogService,
                private device: UhkHidDevice) {
    }

    public async jumpToBootloaderModule(module: ModuleSlotToId): Promise<void> {
        this.logService.usb(`[UhkHidDevice] USB[T]: Jump to bootloader. Module: ${ModuleSlotToId[module].toString()}`);
        const transfer = Buffer.from([UsbCommand.JumpToModuleBootloader, module]);
        await this.device.write(transfer);
    }

    public async updateDeviceFirmware(firmwarePath: string, device: UhkDeviceProduct): Promise<void> {
        this.logService.misc(`[UhkOperations] Start flashing device firmware with ${device.firmwareUpgradeMethod}`);

        switch (device.firmwareUpgradeMethod) {
            case FIRMWARE_UPGRADE_METHODS.KBOOT:
                return this.updateRightFirmwareWithKboot(firmwarePath, device);

            case FIRMWARE_UPGRADE_METHODS.MCUBOOT:
                return this.updateFirmwareWithMcuManager(firmwarePath, device);

            default:
                throw new Error(`Firmware upgrade method not implemented: ${device.firmwareUpgradeMethod}`);
        }
    }

    public async updateRightFirmwareWithKboot(firmwarePath: string, device: UhkDeviceProduct): Promise<void> {
        if (!(await existsAsync(firmwarePath))) {
            throw new Error(`Firmware path not found: ${firmwarePath}`);
        }

        this.logService.misc('[UhkOperations] Start flashing right firmware with kboot');

        this.logService.misc('[UhkOperations] Reenumerate bootloader');
        const reenumerateResult = await this.device.reenumerate({
            device,
            enumerationMode: EnumerationModes.Bootloader,
        });
        this.device.close();
        const kboot = new KBoot(new UsbPeripheral({ productId: reenumerateResult.vidPidPair.pid, vendorId: reenumerateResult.vidPidPair.vid }));
        this.logService.misc('[UhkOperations] Waiting for bootloader');
        await waitForDevice(reenumerateResult.vidPidPair.vid, reenumerateResult.vidPidPair.pid);
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

    public async updateFirmwareWithMcuManager(firmwarePath: string, device: UhkDeviceProduct) {
        if (!(await existsAsync(firmwarePath))) {
            throw new Error(`Firmware path not found: ${firmwarePath}`);
        }

        this.logService.misc(`[UhkOperations] Start flashing ${device.logName} firmware with mcumgr`);

        this.logService.misc('[UhkOperations] Reenumerate bootloader');
        const reenumerateResult = await this.device.reenumerate({
            device,
            enumerationMode: EnumerationModes.Bootloader,
        });
        this.device.close();
        // Give 1 sec to windows to install driver when first time appearing the mcu bootloader
        await snooze(1000);
        this.logService.misc(`[UhkOperations] Init SerialPeripheral: ${reenumerateResult.serialPath}`);
        const peripheral = new SerialPeripheral(reenumerateResult.serialPath);
        const mcuManager = new McuManager(peripheral);
        this.logService.misc(`[UhkOperations] Read ${device.logName} firmware from file`);
        const configData = fs.readFileSync(firmwarePath);
        this.logService.misc('[UhkOperations] Write memory with mcumgr');
        await mcuManager.imageUpload(configData);
        this.logService.misc('[UhkOperations] Reset mcu bootloader');
        await mcuManager.reset();
        this.logService.misc('[UhkOperations] Close mcu communication channels');
        await mcuManager.close();
        this.logService.misc(`[UhkOperations] ${device.logName} firmware successfully flashed`);
    }

    public async updateLeftModuleWithKboot(firmwarePath: string, device: UhkDeviceProduct): Promise<void> {
        return this.updateModuleWithKboot(firmwarePath, device, LEFT_HALF_MODULE);
    }

    public async updateModuleWithKboot(
        firmwarePath: string,
        device: UhkDeviceProduct,
        module: UhkModule
    ): Promise<void> {
        this.logService.misc(`[UhkOperations] Start flashing "${module.name}" module firmware`);
        await this.device.reenumerate({
            device,
            enumerationMode: EnumerationModes.NormalKeyboard,
        });
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(module.i2cAddress, KbootCommands.ping, 100);
        await snooze(1000);
        await this.jumpToBootloaderModule(module.slotId);
        this.device.close();

        const moduleBricked = await this.waitForKbootIdle(module.name);
        if (!moduleBricked) {
            const msg = `[UhkOperations] Couldn't connect to the "${module.name}".`;
            this.logService.error(msg);
            throw new Error(msg);
        }

        const reenumerateResult = await this.device.reenumerate({
            device,
            enumerationMode: EnumerationModes.Buspal,
        });
        this.device.close();
        this.logService.misc('[UhkOperations] Waiting for buspal');
        await waitForDevice(reenumerateResult.vidPidPair.vid, reenumerateResult.vidPidPair.pid);
        const usbPeripheral = new UsbPeripheral({ productId: reenumerateResult.vidPidPair.pid, vendorId: reenumerateResult.vidPidPair.vid });
        let kboot: KBoot;

        const startTime = new Date();
        let connected = false;
        while (new Date().getTime() - startTime.getTime() < 30000) {
            try {
                this.logService.misc(`[UhkOperations] Try to connect to the "${module.name}"`);
                kboot = new KBoot(usbPeripheral);
                await kboot.configureI2c(module.i2cAddress);
                await kboot.getProperty(Properties.BootloaderVersion);
                connected = true;
                break;
            } catch {
                if (kboot) {
                    kboot.close();
                }
                await snooze(2000);
            }
        }

        if (!connected) {
            throw new Error(`Can not connect to the "${module.name}"`);
        }
        // https://github.com/node-hid/node-hid/issues/230
        this.logService.misc('[UhkOperations] Waiting 1s to prevent node-hid race condition');
        await snooze(1000);

        this.logService.misc(`[UhkOperations] Flash erase all on "${module.name}" keyboard`);
        await kboot.configureI2c(module.i2cAddress);
        await kboot.flashEraseAllUnsecure();

        this.logService.misc(`[UhkOperations] Read "${module.name}" firmware from file`);
        const configData = fs.readFileSync(firmwarePath);

        this.logService.misc('[UhkOperations] Write memory');
        await kboot.configureI2c(module.i2cAddress);
        await kboot.writeMemory({ startAddress: 0, data: configData });

        this.logService.misc(`[UhkOperations] Reset "${module.name}" keyboard`);
        await kboot.reset();

        this.logService.misc('[UhkOperations] Close communication channels');
        kboot.close();

        await snooze(1000);
        const reenumerateResult1 = await this.device.reenumerate({
            device,
            enumerationMode: EnumerationModes.NormalKeyboard,
        });
        this.device.close();
        this.logService.misc('[UhkOperations] Waiting for normalKeyboard');
        await waitForDevice(reenumerateResult1.vidPidPair.vid, reenumerateResult1.vidPidPair.pid);
        await this.device.sendKbootCommandToModule(module.i2cAddress, KbootCommands.reset, 100);
        this.device.close();
        await snooze(1000);
        await this.device.sendKbootCommandToModule(module.i2cAddress, KbootCommands.idle);
        this.device.close();

        this.logService.misc(`[UhkOperations] "${module.name}" firmware successfully flashed`);
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
                userConfiguration: JSON.stringify(convertBufferToIntArray(userConfiguration)),
                hardwareConfiguration: JSON.stringify(convertBufferToIntArray(hardwareConfiguration))
            };
        } finally {
            this.device.close();
        }
    }

    /**
     * Return with the actual user / hardware fonfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfiguration(configBufferId: ConfigBufferId): Promise<Buffer> {
        const configBufferIdToName = ['HardwareConfig', 'StagingUserConfig', 'ValidatedUserConfig'];
        const configName = configBufferIdToName[configBufferId];

        try {
            this.logService.usb(`[DeviceOperation] USB[T]: Read ${configName} size from keyboard`);
            let configSize = await this.getConfigSizeFromKeyboard(configBufferId);
            const originalConfigSize = configSize;
            this.logService.usb(`[DeviceOperation] getConfigSize() configSize: ${configSize}`);
            const chunkSize = MAX_USB_PAYLOAD_SIZE - 1;
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

            return configBuffer;
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

    public async saveHardwareConfiguration(isIso: boolean, deviceId: number, uniqueId: number = Math.floor(2 ** 32 * Math.random())): Promise<void> {
        const uhkProduct = ALL_UHK_DEVICES.find(product => product.id === deviceId) || UNKNOWN_DEVICE;
        this.logService.misc(`[DeviceOperation] save hardware configuration: layout: ${isIso ? 'iso' : 'ansi'}, deviceId: ${deviceId} (${uhkProduct.name}), uniqueId: ${uniqueId}`);
        const hardwareConfig = new HardwareConfiguration();

        hardwareConfig.signature = 'UHK';
        hardwareConfig.majorVersion = 1;
        hardwareConfig.minorVersion = 0;
        hardwareConfig.patchVersion = 0;
        hardwareConfig.brandId = 0;
        hardwareConfig.deviceId = deviceId;
        hardwareConfig.uniqueId = uniqueId;
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

    public async waitForKbootIdle(moduleName: string): Promise<boolean> {
        const timeoutTime = new Date(new Date().getTime() + 30000);

        while (new Date() < timeoutTime) {
            const buffer = await this.device.write(Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.CurrentKbootCommand]));
            this.device.close();

            if (buffer[1] === 0) {
                return true;
            }

            this.logService.misc(`[DeviceOperation] Cannot ping the bootloader. Please remove the "${moduleName}" module, and keep reconnecting it until you do not see this message anymore.`);

            await snooze(1000);
        }

        return false;
    }

    public async getModuleProperty({ module, property } : GetModulePropertyArguments): Promise<UhkBuffer> {
        const moduleSlotName = getSlotIdName(module);

        this.logService.usb(`[DeviceOperation] USB[T]: Read "${moduleSlotName}" module "${ModulePropertyId[property]}" property information as string`);

        const command = Buffer.from([
            UsbCommand.GetModuleProperty,
            module,
            property
        ]);

        const buffer = await this.device.write(command);

        return UhkBuffer.fromArray(convertBufferToIntArray(buffer));
    }

    public async getModulePropertyAsString(arg : GetModulePropertyArguments): Promise<string> {
        return this.getModuleProperty(arg).then(readUhkResponseAs0EndString);
    }

    public async getModuleFirmwareChecksum(module: ModuleSlotToId): Promise<string> {
        const moduleSlotName = getSlotIdName(module);
        this.logService.misc(`[DeviceOperation] Read "${moduleSlotName}" firmware checksum`);

        return this.getModulePropertyAsString({ module, property: ModulePropertyId.FirmwareChecksum });
    }

    public async getModuleFirmwareRepoInfo(module: ModuleSlotToId): Promise<FirmwareRepoInfo> {
        const moduleSlotName = getSlotIdName(module);
        this.logService.misc(`[DeviceOperation] Read "${moduleSlotName}" repo information`);

        return {
            firmwareGitRepo: await this.getModulePropertyAsString({ module, property: ModulePropertyId.GitRepo }),
            firmwareGitTag: await this.getModulePropertyAsString({ module, property: ModulePropertyId.GitTag }),
        };
    }

    public async getModuleVersionInfo(module: ModuleSlotToId, includeGitInfo: boolean = false, includeFirmwareChecksum = false): Promise<ModuleVersionInfo> {
        const moduleSlotName = getSlotIdName(module);
        try {
            this.logService.misc(`[DeviceOperation] Read "${moduleSlotName}" version information`);
            this.logService.usb('[DeviceOperation] USB[T]: Read module version information');

            const uhkBuffer = await this.getModuleProperty({ module, property: ModulePropertyId.protocolVersions });
            // skip the first 2 byte
            uhkBuffer.readUInt16();

            let moduleVersionInfo: ModuleVersionInfo =  {
                moduleProtocolVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
                firmwareVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            };

            if (includeGitInfo) {
                moduleVersionInfo = {
                    ...moduleVersionInfo,
                    ...await this.getModuleFirmwareRepoInfo(module)
                };
            }

            if (includeFirmwareChecksum) {
                moduleVersionInfo = {
                    ...moduleVersionInfo,
                    firmwareChecksum: await this.getModuleFirmwareChecksum(module),
                };
            }

            return moduleVersionInfo;
        } catch (error) {
            this.logService.error(`[DeviceOperation] Could not read "${moduleSlotName}" version information`, error);
        }

        return {
            moduleProtocolVersion: '',
            firmwareVersion: ''
        };
    }

    public async getRightModuleProperty(property: DevicePropertyIds, args: Array<number> = []): Promise<UhkBuffer> {
        this.logService.usb(`[DeviceOperation] USB[T]: Device module "${DevicePropertyIds[property]}" property information`);
        const command = Buffer.from([UsbCommand.GetProperty, property, ...args]);
        const buffer = await this.device.write(command);

        return UhkBuffer.fromArray(convertBufferToIntArray(buffer));
    }

    public async getRightModuleFirmwareRepoInfo(): Promise<FirmwareRepoInfo> {
        this.logService.usb('[DeviceOperation] USB[T]: Read device firmware repo information');

        return {
            firmwareGitRepo: readUhkResponseAs0EndString(await this.getRightModuleProperty(DevicePropertyIds.GitRepo)),
            firmwareGitTag: readUhkResponseAs0EndString(await this.getRightModuleProperty(DevicePropertyIds.GitTag))
        };
    }

    public async getDeviceVersionInfo(): Promise<DeviceVersionInformation> {
        // TODO: read device name from UHK Device
        this.logService.usb('[DeviceOperation] USB[T]: Device information');

        const protocolVersions = await this.device.getProtocolVersions();

        let deviceVersionInformation: DeviceVersionInformation = {
            ...protocolVersions,
        };

        if (isDeviceProtocolSupportGitInfo(deviceVersionInformation.deviceProtocolVersion))
            deviceVersionInformation = {
                ...deviceVersionInformation,
                ...await this.getRightModuleFirmwareRepoInfo(),
            };

        if (isDeviceProtocolSupportFirmwareChecksum(deviceVersionInformation.deviceProtocolVersion)) {
            deviceVersionInformation = {
                ...deviceVersionInformation,
                firmwareChecksum: readUhkResponseAs0EndString(await this.getRightModuleProperty(DevicePropertyIds.FirmwareChecksum, [0])),
            };
        }

        return deviceVersionInformation;
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
        const buffer = Buffer.from([UsbCommand.SwitchKeymap, keymapAbbreviationAscii.length, ...keymapAbbreviationAscii]);

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

    public async getVariable(variableId: UsbVariables, iteration: number = 0): Promise<number | string> {
        this.logService.usb(`[DeviceOperation] USB[T]: get variable: ${UsbVariables[variableId]}. Iteration: ${iteration}`);
        const buffer = Buffer.from([UsbCommand.GetVariable, variableId]);
        const responseBuffer = await this.device.write(buffer);

        if (variableId === UsbVariables.statusBuffer) {
            let message = readUhkResponseAs0EndString(UhkBuffer.fromArray(convertBufferToIntArray(responseBuffer)));
            this.logService.misc(`[DeviceOperation] status buffer segment: ${message}`);
            if (message.length === responseBuffer.length - 1 && iteration < 20) {
                message += await this.getVariable(variableId, iteration + 1);
            }

            if (iteration === 0) {
                message = normalizeStatusBuffer(message);
            }

            return message;
        }

        return responseBuffer[1];
    }

    public async pairToDongle(dongle: UhkHidDevice) : Promise<BleAddressPair> {
        const deviceBleAddress = await this.device.getBleAddress();
        this.logService.misc('[DeviceOperation] Device BLE address: ', convertBleAddressArrayToString(deviceBleAddress));
        const dongleBleAddress = await dongle.getBleAddress();
        this.logService.misc('[DeviceOperation] Dongle BLE address: ', convertBleAddressArrayToString(dongleBleAddress));

        this.logService.misc('[DeviceOperation] Device switching to pairing mode');
        await this.device.switchToPairingMode();
        this.logService.misc('[DeviceOperation] Dongle switching to pairing mode');
        await dongle.switchToPairingMode();

        this.logService.misc('[DeviceOperation] Device delete dongle bond');
        await this.device.deleteBond(dongleBleAddress);
        this.logService.misc('[DeviceOperation] Dongle delete all bonds');
        await dongle.deleteAllBonds();

        this.logService.misc('[DeviceOperation] Device read pairing info');
        const devicePairInfo = await this.device.getPairingInfo();
        this.logService.misc('[DeviceOperation] Dongle read pairing info');
        const donglePairInfo = await dongle.getPairingInfo();

        this.logService.misc('[DeviceOperation] Device set pairing info');
        await this.device.setPairingInfo(PairIds.Dongle, donglePairInfo);
        this.logService.misc('[DeviceOperation] Dongle set pairing info');
        await dongle.setPairingInfo(PairIds.Right, devicePairInfo);

        this.logService.misc('[DeviceOperation] Device pair peripheral');
        await this.device.pairPeripheral();
        this.logService.misc('[DeviceOperation] Dongle pair central');
        await dongle.pairCentral();

        this.logService.misc('[DeviceOperation] Device waiting for pairing finished');
        let deviceParingStatus: PairingStatuses;
        await waitUntil({
            shouldWait: async () => {
                deviceParingStatus = await this.device.getPairingStatus();

                return deviceParingStatus === PairingStatuses.InProgress;
            },
            timeout: 5000,
            timeoutErrorMessage: '[DeviceOperation] Device pairing timeout',
            wait: 100,
        });
        this.logService.misc(`[DeviceOperation] Device pairing result: ${PAIRING_STATUS_TEXT[deviceParingStatus]}`);

        this.logService.misc('[DeviceOperation] Dongle waiting for pairing finished');
        let dongleParingStatus: PairingStatuses;
        await waitUntil({
            shouldWait: async () => {
                dongleParingStatus = await dongle.getPairingStatus();

                return dongleParingStatus === PairingStatuses.InProgress;
            },
            timeout: 5000,
            timeoutErrorMessage: '[DeviceOperation] Dongle pairing timeout',
            wait: 100,
        });
        this.logService.misc(`[DeviceOperation] Dongle pairing result: ${PAIRING_STATUS_TEXT[dongleParingStatus]}`);

        this.logService.misc('[DeviceOperation] Device to Dongle pairing finished');

        return {
            address: convertBleAddressArrayToString(deviceBleAddress),
            pairAddress: convertBleAddressArrayToString(dongleBleAddress),
        };
    }

    public async pairToLeftHalf(leftHalf: UhkHidDevice): Promise<BleAddressPair> {
        const deviceBleAddress = await this.device.getBleAddress();
        this.logService.misc('[DeviceOperation] Device BLE address: ', convertBleAddressArrayToString(deviceBleAddress));
        const leftHalfAddress = await leftHalf.getBleAddress();
        this.logService.misc('[DeviceOperation] Left half BLE address: ', convertBleAddressArrayToString(leftHalfAddress));

        this.logService.misc('[DeviceOperation] Device switching to pairing mode');
        await this.device.switchToPairingMode();
        this.logService.misc('[DeviceOperation] Left half switching to pairing mode');
        await leftHalf.switchToPairingMode();

        this.logService.misc('[DeviceOperation] Device delete left half bond');
        await this.device.deleteBond(leftHalfAddress);
        this.logService.misc('[DeviceOperation] Left half delete all bonds');
        await leftHalf.deleteAllBonds();

        this.logService.misc('[DeviceOperation] Device read pairing info');
        const devicePairInfo = await this.device.getPairingInfo();
        this.logService.misc('[DeviceOperation] Left half read pairing info');
        const leftHalfPairInfo = await leftHalf.getPairingInfo();

        this.logService.misc('[DeviceOperation] Left half set pairing info');
        await leftHalf.setPairingInfo(PairIds.Right, devicePairInfo);
        this.logService.misc('[DeviceOperation] Device set pairing info');
        await this.device.setPairingInfo(PairIds.left, leftHalfPairInfo);

        this.logService.misc('[DeviceOperation] Left half pair peripheral');
        await leftHalf.pairPeripheral();
        this.logService.misc('[DeviceOperation] Device pair central');
        await this.device.pairCentral();

        this.logService.misc('[DeviceOperation] Left half waiting for pairing finished');
        let leftHalfParingStatus: PairingStatuses;
        await waitUntil({
            shouldWait: async () => {
                leftHalfParingStatus = await leftHalf.getPairingStatus();

                return leftHalfParingStatus === PairingStatuses.InProgress;
            },
            timeout: 15000,
            timeoutErrorMessage: '[DeviceOperation] Left half pairing timeout',
            wait: 100,
        });
        this.logService.misc(`[DeviceOperation] Left half pairing result: ${PAIRING_STATUS_TEXT[leftHalfParingStatus]}`);

        this.logService.misc('[DeviceOperation] Device waiting for pairing finished');
        let deviceParingStatus: PairingStatuses;
        await waitUntil({
            shouldWait: async () => {
                deviceParingStatus = await this.device.getPairingStatus();

                return deviceParingStatus === PairingStatuses.InProgress;
            },
            timeout: 15000,
            timeoutErrorMessage: '[DeviceOperation] Device pairing timeout',
            wait: 100,
        });
        this.logService.misc(`[DeviceOperation] Device pairing result: ${PAIRING_STATUS_TEXT[deviceParingStatus]}`);

        this.logService.misc('[DeviceOperation] Device to Left half pairing finished');

        return {
            address: convertBleAddressArrayToString(deviceBleAddress),
            pairAddress: convertBleAddressArrayToString(leftHalfAddress),
        };
    }

    public async setVariable(variable: UsbVariables, value: number): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Set Variable');
        await this.device.write(Buffer.from([UsbCommand.SetVariable, variable, value]));
        await this.waitUntilKeyboardBusy();
    }

    public async setI2CBaudRate(rate: number): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Set I2C Baud Rate');
        const buffer = Buffer.alloc(5);
        buffer.writeUInt8(UsbCommand.SetI2cBaudRate, 0);
        buffer.writeUInt32LE(rate, 1);

        await this.device.write(buffer);
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

    public async execMacroCommand(cmd: string): Promise<void> {
        this.logService.usb('[DeviceOperation] USB[T]: Execute Macro Command');
        if (cmd.length <= 63) {
            const b1 = Buffer.from([UsbCommand.ExecMacroCommand]);
            const b2 = Buffer.from(cmd);
            const buffer = Buffer.concat([b1,b2]);
            await this.device.write(buffer);
        }
    }
}
