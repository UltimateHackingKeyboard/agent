import { ipcMain } from 'electron';
import { IpcEvents, LogService, IpcResponse, ConfigurationReply } from 'uhk-common';
import { Constants, EepromTransfer, SystemPropertyIds, UsbCommand } from 'uhk-usb';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Device, devices } from 'node-hid';
import { UhkHidDevice } from 'uhk-usb';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';

/**
 * IpcMain pair of the UHK Communication
 * Functionality:
 * - Detect device is connected or not
 * - Send UserConfiguration to the UHK Device
 * - Read UserConfiguration from the UHK Device
 */
export class DeviceService {
    private pollTimer$: Subscription;
    private connected: boolean = false;

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow,
                private device: UhkHidDevice) {
        this.pollUhkDevice();
        ipcMain.on(IpcEvents.device.saveUserConfiguration, this.saveUserConfiguration.bind(this));
        ipcMain.on(IpcEvents.device.loadConfigurations, this.loadConfigurations.bind(this));
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
        try {
            const userConfiguration = await this.loadConfiguration(
                SystemPropertyIds.UserConfigSize,
                UsbCommand.ReadUserConfig,
                'user configuration');

            const hardwareConfiguration = await this.loadConfiguration(
                SystemPropertyIds.HardwareConfigSize,
                UsbCommand.ReadHardwareConfig,
                'hardware configuration');

            const response: ConfigurationReply = {
                success: true,
                userConfiguration,
                hardwareConfiguration
            };
            event.sender.send(IpcEvents.device.loadConfigurationReply, JSON.stringify(response));
        } catch (error) {
            const response: ConfigurationReply = {
                success: false,
                error: error.message
            };
            event.sender.send(IpcEvents.device.loadConfigurationReply, JSON.stringify(response));
        } finally {
            this.device.close();
        }
    }

    /**
     * Return with the actual user / hardware fonfiguration from UHK Device
     * @returns {Promise<Buffer>}
     */
    public async loadConfiguration(property: SystemPropertyIds, config: UsbCommand, configName: string): Promise<string> {
        let response = [];

        try {
            this.logService.debug(`[DeviceService] USB[T]: Read ${configName} size from keyboard`);
            const configSize = await this.getConfigSizeFromKeyboard(property);
            const chunkSize = 63;
            let offset = 0;
            let configBuffer = new Buffer(0);

            this.logService.debug(`[DeviceService] USB[T]: Read ${configName} from keyboard`);
            while (offset < configSize) {
                const chunkSizeToRead = Math.min(chunkSize, configSize - offset);
                const writeBuffer = Buffer.from([config, chunkSizeToRead, offset & 0xff, offset >> 8]);
                const readBuffer = await this.device.write(writeBuffer);
                configBuffer = Buffer.concat([configBuffer, new Buffer(readBuffer.slice(1, chunkSizeToRead + 1))]);
                offset += chunkSizeToRead;
            }
            response = UhkHidDevice.convertBufferToIntArray(configBuffer);
            return Promise.resolve(JSON.stringify(response));
        } catch (error) {
            const errMsg = `[DeviceService] ${configName} from eeprom error`;
            this.logService.error(errMsg, error);
            throw new Error(errMsg);
        }
    }

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * Every second check the HID device list.
     * @private
     */
    private pollUhkDevice(): void {
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
        const fragments = UhkHidDevice.getTransferBuffers(UsbCommand.UploadUserConfig, buffer);
        for (const fragment of fragments) {
            await this.device.write(fragment);
        }
        this.logService.debug('[DeviceService] USB[T]: Apply user configuration to keyboard');
        const applyBuffer = new Buffer([UsbCommand.ApplyConfig]);
        await this.device.write(applyBuffer);
    }
}
