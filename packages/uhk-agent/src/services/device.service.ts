import { ipcMain } from 'electron';
import { ConfigurationReply, IpcEvents, IpcResponse, LogService } from 'uhk-common';
import {
    Constants,
    convertBufferToIntArray,
    EepromTransfer,
    getTransferBuffers,
    snooze,
    SystemPropertyIds,
    UhkHidDevice,
    UhkOperations,
    UsbCommand
} from 'uhk-usb';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Device, devices } from 'node-hid';
import { emptyDir } from 'fs-extra';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';

import { saveTmpFirmware } from '../util/save-extract-firmware';
import { TmpFirmware } from '../models/tmp-firmware';

/**
 * IpcMain pair of the UHK Communication
 * Functionality:
 * - Detect device is connected or not
 * - Send UserConfiguration to the UHK Device
 * - Read UserConfiguration from the UHK Device
 */
export class DeviceService {
    private pollTimer$: Subscription;
    private connected = false;

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow,
                private device: UhkHidDevice,
                private operations: UhkOperations) {
        this.pollUhkDevice();
        ipcMain.on(IpcEvents.device.saveUserConfiguration, this.saveUserConfiguration.bind(this));
        ipcMain.on(IpcEvents.device.loadConfigurations, this.loadConfigurations.bind(this));
        ipcMain.on(IpcEvents.device.updateFirmware, this.updateFirmware.bind(this));
        ipcMain.on(IpcEvents.device.startConnectionPoller, this.pollUhkDevice.bind(this));
        logService.debug('[DeviceService] init success');
    }

    /**
     * Return with true is an UHK Device is connected to the computer.
     * @returns {boolean}
     */
    public get isConnected(): boolean {
        return this.connected;
    }

    /**
     * Return with the actual UserConfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfigurations(event: Electron.Event): Promise<void> {
        let response: ConfigurationReply;

        try {
            await this.device.waitUntilKeyboardBusy();
            const userConfiguration = await this.loadConfiguration(
                SystemPropertyIds.MaxUserConfigSize,
                UsbCommand.ReadUserConfig,
                'user configuration');

            const hardwareConfiguration = await this.loadConfiguration(
                SystemPropertyIds.HardwareConfigSize,
                UsbCommand.ReadHardwareConfig,
                'hardware configuration');

            response = {
                success: true,
                userConfiguration,
                hardwareConfiguration
            };
            event.sender.send(IpcEvents.device.loadConfigurationReply, JSON.stringify(response));
        } catch (error) {
            response = {
                success: false,
                error: error.message
            };
        } finally {
            this.device.close();
        }

        event.sender.send(IpcEvents.device.loadConfigurationReply, JSON.stringify(response));
    }

    /**
     * Return with the actual user / hardware fonfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfiguration(property: SystemPropertyIds, config: UsbCommand, configName: string): Promise<string> {
        let response = [];

        try {
            this.logService.debug(`[DeviceService] USB[T]: Read ${configName} size from keyboard`);
            let configSize = await this.getConfigSizeFromKeyboard(property);
            const chunkSize = 63;
            let offset = 0;
            let configBuffer = new Buffer(0);
            let firstRead = true;

            this.logService.debug(`[DeviceService] USB[T]: Read ${configName} from keyboard`);
            while (offset < configSize) {
                const chunkSizeToRead = Math.min(chunkSize, configSize - offset);
                const writeBuffer = Buffer.from([config, chunkSizeToRead, offset & 0xff, offset >> 8]);
                const readBuffer = await this.device.write(writeBuffer);
                configBuffer = Buffer.concat([configBuffer, new Buffer(readBuffer.slice(1, chunkSizeToRead + 1))]);
                offset += chunkSizeToRead;

                if (firstRead && config === UsbCommand.ReadUserConfig) {
                    firstRead = false;
                    configSize = readBuffer[6] + (readBuffer[7] << 8);
                }
            }
            response = convertBufferToIntArray(configBuffer);
            return Promise.resolve(JSON.stringify(response));
        } catch (error) {
            const errMsg = `[DeviceService] ${configName} from eeprom error`;
            this.logService.error(errMsg, error);
            throw new Error(errMsg);
        }
    }

    public close(): void {
        this.connected = false;
        this.stopPollTimer();
        this.logService.info('[DeviceService] Device connection checker stopped.');
    }

    public async updateFirmware(event: Electron.Event, data?: string): Promise<void> {
        const response = new IpcResponse();

        let firmwarePathData: TmpFirmware;

        try {
            this.stopPollTimer();

            if (data && data.length > 0) {
                firmwarePathData = await saveTmpFirmware(data);
                await this.operations.updateRightFirmware(firmwarePathData.rightFirmwarePath);
                await this.operations.updateLeftModule(firmwarePathData.leftFirmwarePath);
            }
            else {
                await this.operations.updateRightFirmware();
                await this.operations.updateLeftModule();
            }

            response.success = true;
        } catch (error) {
            const err = {message: error.message, stack: error.stack};
            this.logService.error('[DeviceService] updateFirmware error', err);

            response.error = err;
        }

        if (firmwarePathData) {
            await emptyDir(firmwarePathData.tmpDirectory.name);
        }

        await snooze(500);
        event.sender.send(IpcEvents.device.updateFirmwareReply, response);
    }

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * Every second check the HID device list.
     * @private
     */
    private pollUhkDevice(): void {
        if (this.pollTimer$) {
            return;
        }

        this.pollTimer$ = Observable.interval(1000)
            .startWith(0)
            .map(() => {
                return devices().some((dev: Device) => dev.vendorId === Constants.VENDOR_ID &&
                    dev.productId === Constants.PRODUCT_ID);
            })
            .distinctUntilChanged()
            .do((connected: boolean) => {
                this.connected = connected;
                this.win.webContents.send(IpcEvents.device.deviceConnectionStateChanged, connected);
                this.logService.info(`[DeviceService] Device connection state changed to: ${connected}`);
            })
            .subscribe();
    }

    /**
     * Return the user / hardware configuration size from the UHK Device
     * @returns {Promise<number>}
     */
    private async getConfigSizeFromKeyboard(property: SystemPropertyIds): Promise<number> {
        const buffer = await this.device.write(new Buffer([UsbCommand.GetProperty, property]));
        this.device.close();
        const configSize = buffer[1] + (buffer[2] << 8);
        this.logService.debug('[DeviceService] User config size:', configSize);
        return configSize;
    }

    private async saveUserConfiguration(event: Electron.Event, json: string): Promise<void> {
        const response = new IpcResponse();

        try {
            this.logService.debug('[DeviceService] USB[T]: Write user configuration to keyboard');
            await this.sendUserConfigToKeyboard(json);
            this.logService.debug('[DeviceService] USB[T]: Write user configuration to EEPROM');
            await this.device.writeConfigToEeprom(EepromTransfer.WriteUserConfig);

            response.success = true;
        }
        catch (error) {
            this.logService.error('[DeviceService] Transferring error', error);
            response.error = {message: error.message};
        } finally {
            this.device.close();
        }

        event.sender.send(IpcEvents.device.saveUserConfigurationReply, response);

        return Promise.resolve();
    }

    /**
     * IpcMain handler. Send the UserConfiguration to the UHK Device and send a response with the result.
     * @param {string} json - UserConfiguration in JSON format
     * @returns {Promise<void>}
     * @private
     */
    private async sendUserConfigToKeyboard(json: string): Promise<void> {
        const buffer: Buffer = new Buffer(JSON.parse(json).data);
        const fragments = getTransferBuffers(UsbCommand.UploadUserConfig, buffer);
        for (const fragment of fragments) {
            await this.device.write(fragment);
        }
        this.logService.debug('[DeviceService] USB[T]: Apply user configuration to keyboard');
        const applyBuffer = new Buffer([UsbCommand.ApplyConfig]);
        await this.device.write(applyBuffer);
    }

    private stopPollTimer(): void {
        if (!this.pollTimer$) {
            return;
        }

        this.pollTimer$.unsubscribe();
        this.pollTimer$ = null;

    }
}
