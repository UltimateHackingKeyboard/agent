import fse from 'fs-extra';
import isRoot from 'is-root';
import { Device, HID } from 'node-hid';
import * as path from 'path';
import semver from 'semver';
import { SerialPort } from 'serialport';
import {
    ALL_UHK_DEVICES,
    BLE_ADDRESS_LENGTH,
    Buffer,
    CommandLineArgs,
    DeviceConnectionState,
    FIRMWARE_UPGRADE_METHODS,
    HalvesInfo,
    isEqualArray,
    LeftSlotModules,
    LogService,
    mapI2cAddressToModuleName,
    ModuleSlotToI2cAddress,
    ProtocolVersions,
    RightSlotModules,
    UdevRulesInfo,
    UhkBuffer,
    UHK_BLE_MIN_PRODUCT_iD,
    UHK_DONGLE,
    UHK_80_DEVICE,
    UHK_80_DEVICE_LEFT,
    UHK_VENDOR_ID,
} from 'uhk-common';
import {
    DevicePropertyIds,
    EnumerationModes,
    KbootCommands,
    LAYER_NUMBER_TO_STRING,
    MODULE_ID_TO_STRING,
    PairingStatuses,
    PairIds,
    UsbCommand
} from './constants.js';
import {
    DeviceState,
    PairingInfo,
    ReenumerateOption,
    ReenumerateResult,
} from './models/index.js';
import {
    bufferToString,
    convertBufferToIntArray,
    getFileContentAsync,
    getUhkDevice,
    isBootloader,
    isUhkCommunicationInterface,
    isUhkCommunicationUsage,
    retry,
} from './util.js';
import {
    calculateHalvesState,
    findDeviceByDeviceIdentifier,
    getDeviceEnumerateVidPidPairs,
    getNumberOfConnectedDevices,
    getUhkDevices,
    isDongleCommunicationDevice,
    isSerialPortInVidPids,
    snooze,
    usbDeviceJsonFormatter,
    validateConnectedDevices,
} from './utils/index.js';

export const BOOTLOADER_TIMEOUT_MS = 5000;

enum UsbDeviceConnectionStates {
    Unknown,
    Added,
    Removed,
    AlreadyExisted
}

interface UsvDeviceConnectionState {
    id: string;
    device: Device;
    state: UsbDeviceConnectionStates;
}

export const UHK_HID_DEVICE_NOT_CONNECTED = '[UhkHidDevice] Device is not connected';
/**
 * HID API wrapper to support unified logging and async write
 */
export class UhkHidDevice {
    /**
     * Internal variable that represent the USB UHK device
     * @private
     */
    private _prevDevices = new Map<string, UsvDeviceConnectionState>();
    private _device: HID;
    private _deviceInfo: Device;
    private _hasPermission = false;
    private _protocolVersions: ProtocolVersions | undefined;
    private _udevRulesInfo = UdevRulesInfo.Unknown;

    constructor(private logService: LogService,
                private options: CommandLineArgs,
                private rootDir: string,
                private hidDevice?: Device) {
    }

    /**
     * Return true if the app has right to communicate over the USB.
     * Need only on linux.
     * If return false need to run {project-root}/rules/setup-rules.sh or
     * the Agent will ask permission to run at the first time.
     * @returns {boolean}
     */
    public async hasPermission(): Promise<boolean> {
        if (this.options.spe) {
            return false;
        }

        try {
            if (this._hasPermission) {
                return true;
            }

            this.logService.misc('[UhkHidDevice] Devices before checking permission:');
            const devs = await getUhkDevices();
            this.listAvailableDevices(devs);

            const dev = this.options.vid || this.options['serial-number']
                ? devs.find(findDeviceByDeviceIdentifier(this.options))
                : devs.find((x: Device) => isUhkCommunicationInterface(x) || isBootloader(x));

            if (!dev) {
                return true;
            }

            const device = new HID(dev.path);
            device.close();

            this._hasPermission = true;

            return this._hasPermission;
        } catch (err) {
            this.logService.error('[UhkHidDevice] hasPermission', err);
        }

        return false;
    }

    public async deleteBond(address: number[]): Promise<void> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: Delete all bonds');
        const buffer = Buffer.from([UsbCommand.UnpairAll, ...address]);
        await this.write(buffer);
    }

    public async deleteAllBonds(): Promise<void> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: Delete all bonds');
        const buffer = Buffer.from([UsbCommand.UnpairAll, 0, 0, 0, 0, 0, 0]);
        await this.write(buffer);
    }

    public async getBleAddress(): Promise<number[]> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: get BLE address');
        const buffer = Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.BleAddress]);
        const responseBuffer = await this.write(buffer);

        const address = [];
        // 1st byte is the status code we skip it
        for(let i = 1; i < BLE_ADDRESS_LENGTH + 1; i++) {
            address.push(responseBuffer.readUInt8(i));
        }

        return address;
    }

    public async getPairedRightPairBleAddress(): Promise<number[]> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: get paired right pair BLE address');
        const buffer = Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.PairedRightPeerBleAddress]);
        const responseBuffer = await this.write(buffer);

        const address = [];
        // 1st byte is the status code we skip it
        for(let i = 1; i < BLE_ADDRESS_LENGTH + 1; i++) {
            address.push(responseBuffer.readUInt8(i));
        }

        return address;
    }

    public async getPairingInfo(): Promise<PairingInfo> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: read pairing info');
        const buffer = Buffer.from([UsbCommand.GetPairingData]);
        const responseBuffer = await this.write(buffer);
        const numbers = convertBufferToIntArray(responseBuffer);
        // firs byte is the status code
        const address = numbers.slice(1, 7);
        const r = numbers.slice(7, 23);
        const c = numbers.slice(23, 39);


        return {
            address,
            r,
            c,
        };
    }

    public async getPairingStatus(): Promise<PairingStatuses> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: read pairing info');
        const buffer = Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.PairingStatus]);
        const responseBuffer = await this.write(buffer);

        // 1st byte is the status code we skip it
        const status = responseBuffer.readUInt8(1);

        switch (status) {
            case PairingStatuses.InProgress:
            case PairingStatuses.Success:
            case PairingStatuses.Failed:
                return status;

            default:
                throw new Error(`Unknown pairing status: ${status}`);
        }
    }

    public async isPairedWith(address: number[]): Promise<boolean> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: is paired with');
        const buffer = Buffer.from([
            UsbCommand.IsPaired,
            ...address,
        ]);
        const responseBuffer = await this.write(buffer);
        // 1st byte is the status code we skip it
        const response = responseBuffer.readUInt8(1);

        return response === 1;
    }

    public async pairCentral(): Promise<void> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: pair central');
        const buffer = Buffer.from([UsbCommand.PairCentral]);
        await this.write(buffer);
    }

    public async pairPeripheral(): Promise<void> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: pair peripheral');
        const buffer = Buffer.from([UsbCommand.PairPeripheral]);
        await this.write(buffer);
    }

    public async setPairingInfo(pairId: PairIds, info: PairingInfo): Promise<void> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: set pairing info');
        const buffer = Buffer.from([
            UsbCommand.SetPairingData,
            pairId,
            ...info.address,
            ...info.r,
            ...info.c,
        ]);

        await this.write(buffer);
    }

    public async switchToPairingMode(): Promise<void> {
        await this.assertDeviceSupportWirelessUSBCommands();

        this.logService.usb('[UhkHidDevice] USB[T]: switch to pairing mode');
        const buffer = Buffer.from([UsbCommand.EnterPairingMode]);
        await this.write(buffer);
    }

    public async isDeviceSupportWirelessUSBCommands(): Promise<boolean> {
        const protocolVersions = await this.getProtocolVersions();

        if (semver.lt(protocolVersions.deviceProtocolVersion, '4.11.0')) {
            return false;
        }

        return [UHK_80_DEVICE, UHK_80_DEVICE_LEFT, UHK_DONGLE].some(product => {
            return product.keyboard.some(vidPid => {
                return vidPid.vid === this._deviceInfo.vendorId && vidPid.pid === this._deviceInfo.productId;
            });
        });
    }

    private async assertDeviceSupportWirelessUSBCommands(): Promise<void> {
        const isSupport = await this.isDeviceSupportWirelessUSBCommands();

        if (!isSupport) {
            throw new Error('UHK Device does not support Wireless USB commands.');
        }
    }

    /**
     * Return with the USB device communication sate.
     * @returns {DeviceConnectionState}
     */
    public async getDeviceConnectionStateAsync(): Promise<DeviceConnectionState> {
        const devs = await this.getUhkDevices();
        const result: DeviceConnectionState = {
            bootloaderActive: false,
            bleDeviceConnected: false,
            communicationInterfaceAvailable: false,
            dongle: {
                bootloaderActive: false,
                multiDevice: false,
                serialNumber: '',
            },
            leftHalfBootloaderActive: false,
            hasPermission: await this.hasPermission(),
            halvesInfo: {
                areHalvesMerged: true,
                leftModuleSlot: LeftSlotModules.NoModule,
                isLeftHalfConnected: true,
                rightModuleSlot: RightSlotModules.NoModule
            },
            hardwareModules: {},
            isMacroStatusDirty: false,
            leftHalfDetected: false,
            multiDevice: await getNumberOfConnectedDevices(this.options) > 1,
            udevRulesInfo: await this.getUdevInfoAsync(),
        };

        if (result.multiDevice) {
            return result;
        }

        function setDongleSerialNumber(serialNumber: string): void {
            if (result.dongle.serialNumber) {
                if (result.dongle.serialNumber !== serialNumber) {
                    result.dongle.multiDevice = true;
                }
            }
            else {
                result.dongle.serialNumber = serialNumber;
            }
        }

        for (const dev of devs) {
            if (this.options.vid || this.options['serial-number']) {
                const isUhkDevice = findDeviceByDeviceIdentifier(this.options);

                if (isUhkDevice(dev)) {
                    if (!result.connectedDevice) {
                        result.connectedDevice = getUhkDevice(dev);
                    }

                    if (isUhkCommunicationInterface(dev)) {
                        result.communicationInterfaceAvailable = true;
                    } else if (isBootloader(dev)) {
                        result.bootloaderActive = true;
                    }
                }
            } else {
                if (!result.connectedDevice) {
                    result.connectedDevice = getUhkDevice(dev);
                }

                if (isUhkCommunicationInterface(dev)) {
                    result.communicationInterfaceAvailable = true;
                }
                else if (isBootloader(dev)) {
                    result.bootloaderActive = true;
                }
                else if (dev.vendorId === UHK_VENDOR_ID && dev.productId >= UHK_BLE_MIN_PRODUCT_iD) {
                    result.bleDeviceConnected = true;
                }
                else if (UHK_80_DEVICE_LEFT.keyboard.some(vidPid => dev.vendorId === vidPid.vid && dev.productId === vidPid.pid)) {
                    result.leftHalfDetected = true;
                }
            }

            if (isDongleCommunicationDevice(dev)) {
                setDongleSerialNumber(dev.serialNumber);
            }
        }

        const serialDevices = await SerialPort.list();

        for (const serialDevice of serialDevices) {
            if (isSerialPortInVidPids(serialDevice, UHK_DONGLE.bootloader)) {
                result.dongle.bootloaderActive = true;
                setDongleSerialNumber(serialDevice.serialNumber);
            }
            else if (isSerialPortInVidPids(serialDevice, UHK_80_DEVICE.bootloader)) {
                result.connectedDevice = UHK_80_DEVICE;
                result.bootloaderActive = true;
            }
            else if (isSerialPortInVidPids(serialDevice, UHK_80_DEVICE_LEFT.bootloader)) {
                result.leftHalfBootloaderActive = true;
            }
        }

        if (result.connectedDevice && result.hasPermission && result.communicationInterfaceAvailable) {
            const deviceState = await this.getDeviceState();
            result.halvesInfo = calculateHalvesState(deviceState);
            result.isMacroStatusDirty = deviceState.isMacroStatusDirty;
        } else if (!result.connectedDevice) {
            this._device = undefined;
        }

        return result;
    }

    /**
     * Send data to the UHK device and wait for the response.
     * Throw an error when 1st byte of the response is not 0
     * @param {Buffer} buffer
     * @returns {Promise<Buffer>}
     */
    public async write(buffer: Buffer): Promise<Buffer> {
        return new Promise<Buffer>(async (resolve, reject) => {
            try {
                const device = await this.getDevice();
                const reportId = this.getReportId();

                this.logService.setUsbReportId(reportId);
                const sendData = this.getTransferData(buffer, reportId);
                this.logService.usb('[UhkHidDevice] USB[W]:', bufferToString(sendData));
                device.write(sendData);
                await snooze(1);
                const receivedData = device.readTimeout(1000);
                const logString = bufferToString(receivedData);
                this.logService.usb('[UhkHidDevice] USB[R]:', logString);

                if (reportId) {
                    receivedData.shift();
                }

                if (receivedData[0] !== 0) {
                    return reject(new Error(`Communications error with UHK. Response code: ${receivedData[0]}`));
                }

                return resolve(Buffer.from(receivedData));
            } catch (err) {
                this.logService.error('[UhkHidDevice] Transfer error: ', err);
                this.close();
                return reject(err);
            }

        });
    }

    /**
     * Close the communication chanel with UHK Device
     */
    public close(): void {
        this.logService.misc('[UhkHidDevice] Device communication closing.');
        if (!this._device) {
            return;
        }
        this._device.close();
        this._device = null;
        this.setDeviceInfo(undefined);
        this.logService.misc('[UhkHidDevice] Device communication closed.');
    }

    async reenumerate(
        { enumerationMode, force, device, timeout = BOOTLOADER_TIMEOUT_MS }: ReenumerateOption
    ): Promise<ReenumerateResult> {
        this.close();
        const reenumMode = EnumerationModes[enumerationMode].toString();
        this.logService.misc(`[UhkHidDevice] Start reenumeration, mode: ${reenumMode}, timeout: ${timeout}ms`);
        const vidPidPairs = getDeviceEnumerateVidPidPairs(device, enumerationMode);

        const startTime = new Date();
        const waitTimeout = timeout + 20000;
        let jumped = false;
        let iteration = 0;

        while (new Date().getTime() - startTime.getTime() < waitTimeout) {
            iteration++;
            let allDevice = [];
            for (const vidPid of vidPidPairs) {

                if (enumerationMode === EnumerationModes.Bootloader && device.firmwareUpgradeMethod === FIRMWARE_UPGRADE_METHODS.MCUBOOT) {
                    this.logService.misc('[UhkHidDevice] try to find MCU Bootloader');
                    const serialDevices = await SerialPort.list();
                    // TODO: Implement the listAvailableDevices for serial devices too
                    for (const serialDevice of serialDevices) {
                        if (Number.parseInt(serialDevice.vendorId, 16) === vidPid.vid && Number.parseInt(serialDevice.productId, 16) === vidPid.pid) {
                            return {
                                vidPidPair: vidPid,
                                serialPath: serialDevice.path,
                                usbPath: '',
                            };
                        }
                    }
                } else {
                    const devs = await getUhkDevices([vidPid.vid]);
                    allDevice.push(...devs);

                    const reenumeratedDevice = force && iteration === 1
                        ? false
                        : devs.find((x: Device) =>
                            x.vendorId === vidPid.vid &&
                            x.productId === vidPid.pid);

                    if (reenumeratedDevice) {
                        this.logService.misc('[UhkHidDevice] Reenumerating devices');

                        return {
                            vidPidPair: vidPid,
                            serialPath: '',
                            usbPath: reenumeratedDevice.path,
                        };
                    }
                }
            }

            await snooze(100);

            if (!jumped) {
                let keyboardDevice: HID;
                for (const vidPid of device.keyboard) {
                    const devs = await getUhkDevices([vidPid.vid]);
                    const foundDevice = devs.find((dev: Device) => {
                        return dev.vendorId === vidPid.vid
                            && dev.productId === vidPid.pid
                            // TODO: remove duplication of isUhkCommunicationInterface
                            && isUhkCommunicationUsage(dev);
                    });

                    if (foundDevice) {
                        keyboardDevice = new HID(foundDevice.path);
                        this.setDeviceInfo(foundDevice);
                    }
                }

                if (keyboardDevice) {
                    const reportId = device.reportId;
                    this.logService.setUsbReportId(reportId);
                    const message = Buffer.from([
                        UsbCommand.Reenumerate,
                        enumerationMode,
                        timeout & 0xff,
                        (timeout & 0xff << 8) >> 8,
                        (timeout & 0xff << 16) >> 16,
                        (timeout & 0xff << 24) >> 24
                    ]);
                    const data = this.getTransferData(message, reportId);
                    this.logService.usb(`[UhkHidDevice] USB[T]: Enumerated device, mode: ${reenumMode}`);
                    this.logService.usb('[UhkHidDevice] USB[W]:', bufferToString(data).substr(3));
                    try {
                        keyboardDevice.write(data);
                    } catch (error) {
                        this.logService.misc('[UhkHidDevice] Reenumeration error. We hope it would not break the process', error);
                    } finally {
                        if (keyboardDevice) {
                            try {
                                this.logService.misc('[UhkHidDevice] closing normal keyboard after reenumeration');
                                keyboardDevice.close();
                            } catch (error) {
                                this.logService.misc("[UhkHidDevice] can't normal keyboard after reenumeration", error);
                            }
                        }
                    }
                    jumped = true;
                } else {
                    this.logService.usb('[UhkHidDevice] USB[T]: Enumerated device is not ready yet');
                }
            }
            else {
                this.logService.misc(`[UhkHidDevice] Could not find reenumerated device: ${reenumMode}. Waiting...`);
                this.listAvailableDevices(allDevice, false);
            }
        }

        this.logService.error(`[UhkHidDevice] Could not find reenumerated device: ${reenumMode}. Timeout`);

        throw new Error(`Could not reenumerate as ${reenumMode}`);
    }

    async sendKbootCommandToModule(module: ModuleSlotToI2cAddress, command: KbootCommands, maxTry = 1): Promise<any> {
        let transfer;
        this.logService.usb(`[UhkHidDevice] USB[T]: Send KbootCommand ${mapI2cAddressToModuleName(module)} ${KbootCommands[command].toString()}`);
        if (command === KbootCommands.idle) {
            transfer = Buffer.from([UsbCommand.SendKbootCommandToModule, command]);
        } else {
            transfer = Buffer.from([UsbCommand.SendKbootCommandToModule, command, module]);
        }
        await retry(async () => await this.write(transfer), maxTry, this.logService);
    }

    async getHalvesStates(): Promise<HalvesInfo> {
        const deviceState = await this.getDeviceState();

        return calculateHalvesState(deviceState);
    }

    async getDeviceState(): Promise<DeviceState> {
        const buffer = await this.write(Buffer.from([UsbCommand.GetDeviceState]));
        const activeLayerNumber = buffer[6] & 0x7f;

        return {
            isEepromBusy: buffer[1] !== 0,
            isMacroStatusDirty: buffer[7] !== 0,
            areHalvesMerged: (buffer[2] & 0x1) !== 0,
            isLeftHalfConnected: buffer[3] !== 0,
            activeLayerNumber,
            activeLayerName: LAYER_NUMBER_TO_STRING[activeLayerNumber],
            activeLayerToggled: (buffer[6] & 0x80) === 1,
            leftKeyboardHalfSlot: MODULE_ID_TO_STRING[buffer[3]],
            leftModuleSlot: MODULE_ID_TO_STRING[buffer[4]],
            rightModuleSlot: MODULE_ID_TO_STRING[buffer[5]]
        };
    }

    public listAvailableDevices(devs: Device[], showUnchangedMsg = true): void {
        let hasDeviceChanges = false;
        const compareDevices = devs.map(x => ({
            id: `${x.vendorId}-${x.productId}-${x.interface}`,
            device: x
        }));

        for (const prevDevice of this._prevDevices.values()) {
            prevDevice.state = UsbDeviceConnectionStates.Unknown;
        }

        for (const compareDevice of compareDevices) {
            const existingPrevDevice = this._prevDevices.get(compareDevice.id);

            if (existingPrevDevice) {
                existingPrevDevice.state = UsbDeviceConnectionStates.AlreadyExisted;
            } else {
                this._prevDevices.set(compareDevice.id, {
                    id: compareDevice.id,
                    device: compareDevice.device,
                    state: UsbDeviceConnectionStates.Added
                });
                hasDeviceChanges = true;
            }
        }

        for (const prevDevice of this._prevDevices.values()) {
            if (prevDevice.state === UsbDeviceConnectionStates.Unknown) {
                prevDevice.state = UsbDeviceConnectionStates.Removed;
                hasDeviceChanges = true;
            }
        }

        if (hasDeviceChanges) {
            this.logService.misc('[UhkHidDevice] Available devices changed.');
            for (const prevDevice of Array.from(this._prevDevices.values())) {
                if (prevDevice.state === UsbDeviceConnectionStates.Added) {
                    this.logService.misc(`[UhkHidDevice] Added: ${JSON.stringify(prevDevice.device, usbDeviceJsonFormatter)}`);
                } else if (prevDevice.state === UsbDeviceConnectionStates.Removed) {
                    this.logService.misc(`[UhkHidDevice] Removed: ${JSON.stringify(prevDevice.device, usbDeviceJsonFormatter)}`);
                    this._prevDevices.delete(prevDevice.id);
                }
            }
        } else if (showUnchangedMsg) {
            this.logService.misc('[UhkHidDevice] Available devices unchanged');
        }
    }

    async getProtocolVersions(): Promise<ProtocolVersions> {
        if (this._protocolVersions) {
            return this._protocolVersions;
        }

        this.logService.usb('[UhkHidDevice] USB[T]: Read device protocol version information');
        const command = Buffer.from([UsbCommand.GetProperty, DevicePropertyIds.ProtocolVersions]);
        const buffer = await this.write(command);
        const uhkBuffer = UhkBuffer.fromArray(convertBufferToIntArray(buffer));
        // skip the first byte
        uhkBuffer.readUInt8();

        this._protocolVersions = {
            firmwareVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            deviceProtocolVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            moduleProtocolVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            userConfigVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            hardwareConfigVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`,
            smartMacrosVersion: `${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}.${uhkBuffer.readUInt16()}`
        };

        this.logService.misc('[UhkHidDevice] protocol versions: ' + JSON.stringify(this._protocolVersions));

        return this._protocolVersions;
    }

    public async getUdevInfoAsync(): Promise<UdevRulesInfo> {
        if (this._udevRulesInfo === UdevRulesInfo.Ok) {
            return UdevRulesInfo.Ok;
        }

        if (process.platform === 'win32' || process.platform === 'darwin') {
            this._udevRulesInfo = UdevRulesInfo.Ok;
            return UdevRulesInfo.Ok;
        }

        if (isRoot()) {
            this._udevRulesInfo = UdevRulesInfo.Ok;
            return UdevRulesInfo.Ok;
        }

        if (this.options['preserve-udev-rules']) {
            this._udevRulesInfo = UdevRulesInfo.Ok;
            return UdevRulesInfo.Ok;
        }

        if (!(await fse.pathExists('/etc/udev'))) {
            return UdevRulesInfo.UdevDirNotExists;
        }

        if (!(await fse.pathExists('/etc/udev/rules.d/50-uhk60.rules'))) {
            return UdevRulesInfo.NeedToSetup;
        }

        const expectedUdevSettings = await getFileContentAsync(path.join(this.rootDir, 'rules/50-uhk60.rules'));
        const currentUdevSettings = await getFileContentAsync('/etc/udev/rules.d/50-uhk60.rules');

        if (isEqualArray(expectedUdevSettings, currentUdevSettings)) {
            this._udevRulesInfo = UdevRulesInfo.Ok;
            return UdevRulesInfo.Ok;
        }

        return UdevRulesInfo.Different;
    }

    /**
     * Return the stored version of HID device. If not exist try to initialize.
     * @returns {HID}
     * @private
     */
    private async getDevice(): Promise<HID> {
        if (!this._device) {
            this._device = await this.connectToDevice();

            if (!this._device) {
                throw new Error(UHK_HID_DEVICE_NOT_CONNECTED);
            }
        }

        return this._device;
    }

    /**
     * Initialize new UHK HID device.
     */
    private async connectToDevice(): Promise<HID> {
        try {
            const devs = await this.getUhkDevices();
            this.listAvailableDevices(devs);

            await validateConnectedDevices(this.options);

            if (this.hidDevice) {
                const device = devs.find(dev => dev.path === this.hidDevice.path);
                if (device) {
                    this.setDeviceInfo(this.hidDevice);
                }
                else {
                    this.logService.misc(`[UhkHidDevice] UHK Device not found with path: ${this.hidDevice.path}`);
                }
            }
            else if ( this.options.vid || this.options['serial-number']) {
                this.setDeviceInfo(devs.find(findDeviceByDeviceIdentifier(this.options)));
            }
            else  {
                this.setDeviceInfo(devs.find(isUhkCommunicationInterface));
            }

            if (!this._deviceInfo) {
                this.logService.misc('[UhkHidDevice] UHK Device not found:');
                return null;
            }
            const device = new HID(this._deviceInfo.path);
            if (this.options['usb-non-blocking']) {
                this.logService.misc('[UhkHidDevice] set non blocking communication mode');
                this._device.setNonBlocking(1 as any);
            }
            this.logService.misc('[UhkHidDevice] Used device:', JSON.stringify(this._deviceInfo, usbDeviceJsonFormatter));
            return device;
        } catch (err) {
            this.logService.error('[UhkHidDevice] Can not create device:', err);
        }

        return null;
    }

    /**
     * Based on the command line arguments and deviceInfo it calculate the reportId
     * @private
     */
    private getReportId(): number {
        if (this.options['no-report-id']) {
            return undefined;
        }

        if (this.options['report-id'] !== undefined) {
            return Number(this.options['report-id']);
        }

        const uhkProduct = ALL_UHK_DEVICES.find(device => {
            return device.keyboard.some(x => x.vid === this._deviceInfo.vendorId && x.pid === this._deviceInfo.productId) ||
                device.bootloader.some(x => x.vid === this._deviceInfo.vendorId && x.pid === this._deviceInfo.productId) ||
                device.buspal.some(x => x.vid === this._deviceInfo.vendorId && x.pid === this._deviceInfo.productId);
        });

        return uhkProduct?.reportId || 0;
    }

    /**
     * Create the communication package that will send over USB and
     * @param {Buffer} buffer
     * @param {number} reportId
     * @returns {number[]}
     * @private
     * @static
     */
    private getTransferData(buffer: Buffer, reportId: number): number[] {
        const data = convertBufferToIntArray(buffer);

        if (reportId !== undefined) {
            data.unshift(reportId);
        }

        return data;
    }

    private async getUhkDevices(): Promise<Array<Device>> {
        return this.options.vid
            ? getUhkDevices([this.options.vid])
            : getUhkDevices();
    }

    private setDeviceInfo(device:Device | undefined): void {
        this._deviceInfo = device;
        this._protocolVersions = undefined;
    }
}
