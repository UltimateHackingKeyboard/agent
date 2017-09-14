import { ipcMain } from 'electron';

import { Constants, IpcEvents, LogService, IpcResponse } from 'uhk-common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Device, devices } from 'node-hid';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';

import { UhkHidDeviceService } from './uhk-hid-device.service';

/**
 * UHK USB Communications command. All communication package should have start with a command code.
 */
enum Command {
    GetProperty = 0,
    UploadConfig = 8,
    ApplyConfig = 9,
    LaunchEepromTransfer = 12,
    ReadUserConfig = 15,
    GetKeyboardState = 16
}

enum EepromTransfer {
    ReadHardwareConfig = 0,
    WriteHardwareConfig = 1,
    ReadUserConfig = 2,
    WriteUserConfig = 3
}

enum SystemPropertyIds {
    UsbProtocolVersion = 0,
    BridgeProtocolVersion = 1,
    DataModelVersion = 2,
    FirmwareVersion = 3,
    HardwareConfigSize = 4,
    UserConfigSize = 5
}

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

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
                private device: UhkHidDeviceService) {
        this.pollUhkDevice();
        ipcMain.on(IpcEvents.device.saveUserConfiguration, this.saveUserConfiguration.bind(this));
        ipcMain.on(IpcEvents.device.loadUserConfiguration, this.loadUserConfiguration.bind(this));
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
    public async loadUserConfiguration(event: Electron.Event): Promise<void> {
        let response = [];

        try {
            const configSize = await this.getUserConfigSizeFromKeyboard();
            const chunkSize = 63;
            let offset = 0;
            let configBuffer = new Buffer(0);

            while (offset < configSize) {
                const chunkSizeToRead = Math.min(chunkSize, configSize - offset);
                const writeBuffer = Buffer.from([Command.ReadUserConfig, chunkSizeToRead, offset & 0xff, offset >> 8]);
                const readBuffer = await this.device.write(writeBuffer);
                configBuffer = Buffer.concat([configBuffer, new Buffer(readBuffer.slice(1, chunkSizeToRead + 1))]);
                offset += chunkSizeToRead;
            }
            response = UhkHidDeviceService.convertBufferToIntArray(configBuffer);
        } catch (error) {
            this.logService.error('[DeviceService] getUserConfigFromEeprom error', error);
        } finally {
            this.device.close();
        }

        event.sender.send(IpcEvents.device.loadUserConfigurationReply, JSON.stringify(response));
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
     * Return the UserConfiguration size from the UHK Device
     * @returns {Promise<number>}
     */
    private async getUserConfigSizeFromKeyboard(): Promise<number> {
        const buffer = await this.device.write(new Buffer([Command.GetProperty, SystemPropertyIds.UserConfigSize]));
        const configSize = buffer[1] + (buffer[2] << 8);
        this.logService.debug('[DeviceService] User config size:', configSize);
        return configSize;
    }

    private async saveUserConfiguration(event: Electron.Event, json: string): Promise<void> {
        const response = new IpcResponse();

        try {
            this.sendUserConfigToKeyboard(json);
            await this.writeUserConfigToEeprom();

            response.success = true;
            this.logService.info('transferring finished');
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
        const fragments = this.getTransferBuffers(buffer);
        for (const fragment of fragments) {
            await this.device.write(fragment);
        }

        const applyBuffer = new Buffer([Command.ApplyConfig]);
        await this.device.write(applyBuffer);
        this.logService.info('[DeviceService] Transferring finished');
    }

    private async writeUserConfigToEeprom(): Promise<void> {
        this.logService.info('[DeviceService] Start write user configuration to eeprom');

        const buffer = await this.device.write(new Buffer([Command.LaunchEepromTransfer, EepromTransfer.WriteUserConfig]));
        await this.waitUntilKeyboardBusy();

        this.logService.info('[DeviceService] End write user configuration to eeprom');
    }

    private async waitUntilKeyboardBusy(): Promise<void> {
        while (true) {
            const buffer = await this.device.write(new Buffer([Command.GetKeyboardState]));
            if (buffer[1] === 0) {
                break;
            }
            this.logService.debug('Keyboard is busy, wait...');
            await snooze(200);
        }
    }

    /**
     * Split the whole UserConfiguration package into 64 byte fragments
     * @param {Buffer} configBuffer
     * @returns {Buffer[]}
     * @private
     */
    private getTransferBuffers(configBuffer: Buffer): Buffer[] {
        const fragments: Buffer[] = [];
        const MAX_SENDING_PAYLOAD_SIZE = Constants.MAX_PAYLOAD_SIZE - 4;
        for (let offset = 0; offset < configBuffer.length; offset += MAX_SENDING_PAYLOAD_SIZE) {
            const length = offset + MAX_SENDING_PAYLOAD_SIZE < configBuffer.length
                ? MAX_SENDING_PAYLOAD_SIZE
                : configBuffer.length - offset;
            const header = new Buffer([Command.UploadConfig, length, offset & 0xFF, offset >> 8]);
            fragments.push(Buffer.concat([header, configBuffer.slice(offset, offset + length)]));
        }

        return fragments;
    }
}
