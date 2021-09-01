import { Device, HID, setDriverType } from 'node-hid';
import { pathExists } from 'fs-extra';
import * as path from 'path';
import isRoot = require('is-root');
import {
    Buffer,
    CommandLineArgs,
    DeviceConnectionState,
    HalvesInfo,
    isEqualArray,
    LeftSlotModules,
    LogService,
    mapI2cAddressToModuleName,
    ModuleSlotToI2cAddress,
    RightSlotModules,
    UdevRulesInfo
} from 'uhk-common';

import {
    EnumerationModes,
    KbootCommands,
    LAYER_NUMBER_TO_STRING,
    MODULE_ID_TO_STRING,
    UsbCommand
} from './constants';
import {
    bufferToString,
    getFileContentAsync,
    getTransferData,
    isBootloader,
    getUhkDevice,
    isUhkZeroInterface,
    retry,
    snooze
} from './util';
import { DeviceState, GetDeviceOptions, ReenumerateOption } from './models';
import { getNumberOfConnectedDevices, getUhkDevices, usbDeviceJsonFormatter } from './utils';

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
    private _hasPermission = false;
    private _udevRulesInfo = UdevRulesInfo.Unknown;

    constructor(private logService: LogService,
                private options: CommandLineArgs,
                private rootDir: string) {
        if (options['usb-driver'] === 'libusb') {
            setDriverType('libusb');
        }
    }

    /**
     * Return true if the app has right to communicate over the USB.
     * Need only on linux.
     * If return false need to run {project-root}/rules/setup-rules.sh or
     * the Agent will ask permission to run at the first time.
     * @returns {boolean}
     */
    public hasPermission(): boolean {
        if (this.options.spe) {
            return false;
        }

        try {
            if (this._hasPermission) {
                return true;
            }

            this.logService.misc('[UhkHidDevice] Devices before checking permission:');
            const devs = getUhkDevices();
            this.listAvailableDevices(devs);

            const dev = devs.find((x: Device) => isUhkZeroInterface(x) || isBootloader(x));

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

    /**
     * Return with the USB device communication sate.
     * @returns {DeviceConnectionState}
     */
    public async getDeviceConnectionStateAsync(): Promise<DeviceConnectionState> {
        const devs = getUhkDevices();
        const result: DeviceConnectionState = {
            bootloaderActive: false,
            zeroInterfaceAvailable: false,
            hasPermission: this.hasPermission(),
            halvesInfo: {
                areHalvesMerged: true,
                leftModuleSlot: LeftSlotModules.NoModule,
                isLeftHalfConnected: true,
                rightModuleSlot: RightSlotModules.NoModule
            },
            hardwareModules: {},
            multiDevice: getNumberOfConnectedDevices() > 1
        };

        if (result.multiDevice) {
            return result;
        }

        for (const dev of devs) {
            if (!result.connectedDevice) {
                result.connectedDevice = getUhkDevice(dev);
            }

            if (isUhkZeroInterface(dev)) {
                result.zeroInterfaceAvailable = true;
            } else if (isBootloader(dev)) {
                result.bootloaderActive = true;
            }
        }

        if (result.connectedDevice && result.hasPermission && result.zeroInterfaceAvailable) {
            result.halvesInfo = await this.getHalvesStates();
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
    public write(buffer: Buffer): Promise<Buffer> {
        this.logService.misc('[UhkHidDevice] options', this.options);
        if (this.options['usb-read-mode'] === 'onData') {
            return this.writeOnData(buffer);
        }

        return this.writeReadTimeout(buffer);
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
        this.logService.misc('[UhkHidDevice] Device communication closed.');
    }

    async reenumerate(
        { enumerationMode, productId, vendorId, timeout = BOOTLOADER_TIMEOUT_MS }: ReenumerateOption
    ): Promise<void> {
        const reenumMode = EnumerationModes[enumerationMode].toString();
        this.logService.misc(`[UhkHidDevice] Start reenumeration, mode: ${reenumMode}, timeout: ${timeout}ms`);

        const message = Buffer.from([
            UsbCommand.Reenumerate,
            enumerationMode,
            timeout & 0xff,
            (timeout & 0xff << 8) >> 8,
            (timeout & 0xff << 16) >> 16,
            (timeout & 0xff << 24) >> 24
        ]);

        const startTime = new Date();
        const waitTimeout = timeout + 20000;
        let jumped = false;

        while (new Date().getTime() - startTime.getTime() < waitTimeout) {
            const devs = getUhkDevices();

            const inBootloaderMode = devs.some((x: Device) =>
                x.vendorId === vendorId &&
                x.productId === productId);

            if (inBootloaderMode) {
                this.logService.misc('[UhkHidDevice] Reenumerating devices');
                return;
            }

            await snooze(100);

            if (!jumped) {
                const device = this.getDevice({ errorLogLevel: 'misc' });
                if (device) {
                    const data = getTransferData(message);
                    this.logService.usb(`[UhkHidDevice] USB[T]: Enumerated device, mode: ${reenumMode}`);
                    this.logService.usb('[UhkHidDevice] USB[W]:', bufferToString(data).substr(3));
                    try {
                        device.write(data);
                        device.close();
                    } catch (error) {
                        this.logService.misc('[UhkHidDevice] Reenumeration error. We hope it would not break the process', error);
                    }
                    jumped = true;
                } else {
                    this.logService.usb('[UhkHidDevice] USB[T]: Enumerated device is not ready yet');
                }
            } else {
                this.logService.misc(`[UhkHidDevice] Could not find reenumerated device: ${reenumMode}. Waiting...`);
                this.listAvailableDevices(devs, false);
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

        return {
            areHalvesMerged: deviceState.areHalvesMerged,
            isLeftHalfConnected: deviceState.isLeftHalfConnected,
            leftModuleSlot: LeftSlotModules[deviceState.leftModuleSlot],
            rightModuleSlot: RightSlotModules[deviceState.rightModuleSlot]
        };
    }

    async getDeviceState(): Promise<DeviceState> {
        const buffer = await this.write(Buffer.from([UsbCommand.GetDeviceState]));
        const activeLayerNumber = buffer[6] & 0x7f;

        return {
            isEepromBusy: buffer[1] !== 0,
            areHalvesMerged: buffer[2] !== 0,
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

        if (!(await pathExists('/etc/udev'))) {
            return UdevRulesInfo.UdevDirNotExists;
        }

        if (!(await pathExists('/etc/udev/rules.d/50-uhk60.rules'))) {
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
    private getDevice(options?: GetDeviceOptions) {
        if (!this._device) {
            this._device = this.connectToDevice(options);
        }

        return this._device;
    }

    /**
     * Initialize new UHK HID device.
     * @returns {HID}
     */
    private connectToDevice({ errorLogLevel = 'error' }: GetDeviceOptions = {}): HID {
        try {
            const devs = getUhkDevices();
            this.listAvailableDevices(devs);

            const dev = devs.find(isUhkZeroInterface);

            if (!dev) {
                this.logService.misc('[UhkHidDevice] UHK Device not found:');
                return null;
            }
            const device = new HID(dev.path);
            this.logService.misc('[UhkHidDevice] Used device:', JSON.stringify(dev, usbDeviceJsonFormatter));
            return device;
        } catch (err) {
            this.logService[errorLogLevel]('[UhkHidDevice] Can not create device:', err);
        }

        return null;
    }

    private writeReadTimeout(buffer: Buffer): Promise<Buffer> {
        this.logService.misc('[UhkHidDevice] Use writeReadTimeout');

        return new Promise<Buffer>(async (resolve, reject) => {
            const device = this.getDevice();

            if (!device) {
                return reject(new Error('[UhkHidDevice] Device is not connected'));
            }

            try {
                const sendData = getTransferData(buffer);
                this.logService.usb('[UhkHidDevice] USB[W]:', bufferToString(sendData).substr(3));
                device.write(sendData);
                await snooze(1);
                const receivedData = device.readTimeout(1000);
                const logString = bufferToString(receivedData);
                this.logService.usb('[UhkHidDevice] USB[R]:', logString);

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

    private writeOnData(buffer: Buffer): Promise<Buffer> {
        this.logService.misc('[UhkHidDevice] Use writeOnData');

        return new Promise<Buffer>((resolve, reject) => {
            this.close();
            const device = this.getDevice();

            if (!device) {
                return reject(new Error('[UhkHidDevice] Device is not connected'));
            }

            try {
                const sendData = getTransferData(buffer);
                this.logService.usb('[UhkHidDevice] USB[W]:', bufferToString(sendData).substr(3));
                device.setNonBlocking(true);
                device.on('data', receivedData => {
                    const logString = bufferToString(receivedData);
                    this.logService.usb('[UhkHidDevice] USB[R]:', logString);

                    if (receivedData[0] !== 0) {
                        return reject(new Error(`Communications error with UHK. Response code: ${receivedData[0]}`));
                    }

                    return resolve(Buffer.from(receivedData));
                });
                device.on('error', err => {
                    this.logService.error('[UhkHidDevice] Transfer error: ', err);
                    return reject(err);
                });
                device.write(sendData);
            } catch (err) {
                this.logService.error('[UhkHidDevice] Transfer error: ', err);
                return reject(err);
            }
        })
            .then(resultBuffer => {
                this.close();
                return resultBuffer;
            })
            .catch(error => {
                this.close();
                throw error;
            });
    }

}
