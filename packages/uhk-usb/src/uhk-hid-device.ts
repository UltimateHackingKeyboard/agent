import { Device, devices, HID } from 'node-hid';
import { pathExists } from 'fs-extra';
import * as path from 'path';
import { platform } from 'os';
import isRoot = require('is-root');
import { Buffer, CommandLineArgs, DeviceConnectionState, HalvesInfo, isEqualArray, LogService, UdevRulesInfo } from 'uhk-common';

import {
    ConfigBufferId,
    Constants,
    EepromOperation,
    enumerationModeIdToProductId,
    EnumerationModes,
    KbootCommands,
    ModuleSlotToI2cAddress,
    ModuleSlotToId,
    UsbCommand,
    UsbVariables
} from './constants';
import { bufferToString, getFileContentAsync, getTransferData, isUhkDevice, isUhkZeroInterface, retry, snooze } from './util';
import { GetDeviceOptions } from './models';

export const BOOTLOADER_TIMEOUT_MS = 5000;

/**
 * HID API wrapper to support unified logging and async write
 */
export class UhkHidDevice {
    /**
     * Internal variable that represent the USB UHK device
     * @private
     */
    private _prevDevices = [];
    private _device: HID;
    private _hasPermission = false;
    private _udevRulesInfo = UdevRulesInfo.Unknown;

    constructor(private logService: LogService,
                private options: CommandLineArgs,
                private rootDir: string) {
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

            this.logService.debug('[UhkHidDevice] Devices before checking permission:');
            const devs = devices();
            this.logDevices(devs);

            const dev = devs.find((x: Device) => isUhkZeroInterface(x) || x.productId === Constants.BOOTLOADER_ID);

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
        const devs = devices();
        const result: DeviceConnectionState = {
            bootloaderActive: false,
            connected: false,
            zeroInterfaceAvailable: false,
            hasPermission: this.hasPermission(),
            udevRulesInfo: await this.getUdevInfoAsync(),
            halvesInfo: { areHalvesMerged: true, isLeftHalfConnected: true }
        };

        for (const dev of devs) {
            if (isUhkDevice(dev)) {
                result.connected = true;
            }

            if (isUhkZeroInterface(dev)) {
                result.zeroInterfaceAvailable = true;
            } else if (dev.vendorId === Constants.VENDOR_ID &&
                dev.productId === Constants.BOOTLOADER_ID) {
                result.bootloaderActive = true;
            }
        }

        if (result.connected && result.hasPermission && result.zeroInterfaceAvailable) {
            result.halvesInfo = await this.getHalvesStates();
        } else if (!result.connected) {
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
            const device = this.getDevice();

            if (!device) {
                return reject(new Error('[UhkHidDevice] Device is not connected'));
            }

            try {
                const sendData = getTransferData(buffer);
                this.logService.debug('[UhkHidDevice] USB[W]:', bufferToString(sendData).substr(3));
                device.write(sendData);
                await snooze(1);
                const receivedData = device.readTimeout(1000);
                const logString = bufferToString(receivedData);
                this.logService.debug('[UhkHidDevice] USB[R]:', logString);

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

    public async writeConfigToEeprom(configBufferId: ConfigBufferId): Promise<void> {
        await this.write(Buffer.from([UsbCommand.LaunchEepromTransfer, EepromOperation.write, configBufferId]));
        await this.waitUntilKeyboardBusy();
    }

    public async enableUsbStackTest(): Promise<void> {
        await this.write(Buffer.from([UsbCommand.SetVariable, UsbVariables.testUsbStack, 1]));
        await this.waitUntilKeyboardBusy();
    }

    /**
     * Close the communication chanel with UHK Device
     */
    public close(): void {
        this.logService.debug('[UhkHidDevice] Device communication closing.');
        if (!this._device) {
            return;
        }
        this._device.close();
        this._device = null;
        this.logService.debug('[UhkHidDevice] Device communication closed.');
    }

    public async waitUntilKeyboardBusy(): Promise<void> {
        while (true) {
            const buffer = await this.write(Buffer.from([UsbCommand.GetDeviceState]));
            if (buffer[1] === 0) {
                break;
            }
            this.logService.debug('Keyboard is busy, wait...');
            await snooze(200);
        }
    }

    public resetDeviceCache(): void {
        this._prevDevices = [];
    }

    async reenumerate(enumerationMode: EnumerationModes): Promise<void> {
        const reenumMode = EnumerationModes[enumerationMode].toString();
        this.logService.debug(`[UhkHidDevice] Start reenumeration, mode: ${reenumMode}`);

        const message = Buffer.from([
            UsbCommand.Reenumerate,
            enumerationMode,
            BOOTLOADER_TIMEOUT_MS & 0xff,
            (BOOTLOADER_TIMEOUT_MS & 0xff << 8) >> 8,
            (BOOTLOADER_TIMEOUT_MS & 0xff << 16) >> 16,
            (BOOTLOADER_TIMEOUT_MS & 0xff << 24) >> 24
        ]);

        const enumeratedProductId = enumerationModeIdToProductId[enumerationMode.toString()];
        const startTime = new Date();
        let jumped = false;

        while (new Date().getTime() - startTime.getTime() < 20000) {
            const devs = devices();

            const inBootloaderMode = devs.some((x: Device) =>
                x.vendorId === Constants.VENDOR_ID &&
                x.productId === enumeratedProductId);

            if (inBootloaderMode) {
                this.logService.debug(`[UhkHidDevice] Reenumerating devices`);
                return;
            }

            await snooze(100);

            if (!jumped) {
                const device = this.getDevice({ errorLogLevel: 'debug'});
                if (device) {
                    const data = getTransferData(message);
                    this.logService.debug(`[UhkHidDevice] USB[T]: Enumerated device, mode: ${reenumMode}`);
                    this.logService.debug('[UhkHidDevice] USB[W]:', bufferToString(data).substr(3));
                    device.write(data);
                    device.close();
                    jumped = true;
                } else {
                    this.logService.debug('[UhkHidDevice] USB[T]: Enumerated device is not ready yet');
                }
            }
            else {
                this.logService.debug(`[UhkHidDevice] Could not find reenumerated device: ${reenumMode}. Waiting...`);
                this.listAvailableDevices(devs);
            }
        }

        this.logService.error(`[UhkHidDevice] Could not find reenumerated device: ${reenumMode}. Timeout`);

        throw new Error(`Could not reenumerate as ${reenumMode}`);
    }

    async sendKbootCommandToModule(module: ModuleSlotToI2cAddress, command: KbootCommands, maxTry = 1): Promise<any> {
        let transfer;
        const moduleName = kbootCommandName(module);
        this.logService.debug(`[UhkHidDevice] USB[T]: Send KbootCommand ${moduleName} ${KbootCommands[command].toString()}`);
        if (command === KbootCommands.idle) {
            transfer = Buffer.from([UsbCommand.SendKbootCommandToModule, command]);
        } else {
            transfer = Buffer.from([UsbCommand.SendKbootCommandToModule, command, Number.parseInt(module, 16)]);
        }
        await retry(async () => await this.write(transfer), maxTry, this.logService);
    }

    async jumpToBootloaderModule(module: ModuleSlotToId): Promise<any> {
        this.logService.debug(`[UhkHidDevice] USB[T]: Jump to bootloader. Module: ${ModuleSlotToId[module].toString()}`);
        const transfer = Buffer.from([UsbCommand.JumpToModuleBootloader, module]);
        await this.write(transfer);
    }

    async getHalvesStates(): Promise<HalvesInfo> {
        const buffer = await this.write(Buffer.from([UsbCommand.GetDeviceState]));

        return {
            areHalvesMerged: buffer[2] !== 0,
            isLeftHalfConnected: buffer[3] !== 0
        };
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
            const devs = devices();
            this.listAvailableDevices(devs);

            const dev = devs.find(isUhkZeroInterface);

            if (!dev) {
                this.logService.debug('[UhkHidDevice] UHK Device not found:');
                return null;
            }
            const device = new HID(dev.path);
            this.logService.debug('[UhkHidDevice] Used device:', JSON.stringify(dev));
            return device;
        } catch (err) {
            this.logService[errorLogLevel]('[UhkHidDevice] Can not create device:', err);
        }

        return null;
    }

    private logDevices(devs: Array<Device>): void {
        for (const logDevice of devs) {
            this.logService.debug(JSON.stringify(logDevice));
        }
    }

    private async getUdevInfoAsync(): Promise<UdevRulesInfo> {
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

    private listAvailableDevices(devs: Device[]): void {
        let compareDevices = devs as any;

        if (platform() === 'linux') {
            compareDevices = devs.map(x => ({
                productId: x.productId,
                vendorId: x.vendorId,
                interface: x.interface
            }));
        }

        if (!isEqualArray(this._prevDevices, compareDevices)) {
            this.logService.debug('[UhkHidDevice] Available devices:');
            this.logDevices(devs);
            this._prevDevices = compareDevices;
        } else {
            this.logService.debug('[UhkHidDevice] Available devices unchanged');
        }
    }

}

function kbootCommandName(module: ModuleSlotToI2cAddress): string {
    switch (module) {
        case ModuleSlotToI2cAddress.leftHalf:
            return 'leftHalf';

        case ModuleSlotToI2cAddress.leftModule:
            return 'leftModule';

        case ModuleSlotToI2cAddress.rightModule:
            return 'rightModule';

        default:
            return 'Unknown';
    }
}
