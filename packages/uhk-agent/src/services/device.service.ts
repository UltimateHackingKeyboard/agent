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
    UploadConfig = 8,
    ApplyConfig = 9
}

/**
 * IpcMain pair of the UHK Communication
 * Functionality:
 * - Detect device is connected or not
 * - Send UserConfiguration to the UHK Device
 */
export class DeviceService {
    private pollTimer$: Subscription;
    private connected: boolean = false;

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow,
                private device: UhkHidDeviceService) {
        this.pollUhkDevice();
        ipcMain.on(IpcEvents.device.saveUserConfiguration, this.saveUserConfiguration.bind(this));
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
                this.logService.info(`Device connection state changed to: ${connected}`);
            })
            .subscribe();
    }

    /**
     * IpcMain handler. Send the UserConfiguration to the UHK Device and send a response with the result.
     * @param {Electron.Event} event - ipc event
     * @param {string} json - UserConfiguration in JSON format
     * @returns {Promise<void>}
     * @private
     */
    private async saveUserConfiguration(event: Electron.Event, json: string): Promise<void> {
        const response = new IpcResponse();

        try {
            const buffer: Buffer = new Buffer(JSON.parse(json).data);
            const fragments = this.getTransferBuffers(buffer);
            for (const fragment of fragments) {
                await this.device.write(fragment);
            }

            const applyBuffer = new Buffer([Command.ApplyConfig]);
            await this.device.write(applyBuffer);
            this.device.close();
            response.success = true;
            this.logService.info('[DeviceService] Transferring finished');
        }
        catch (error) {
            this.logService.error('[DeviceService] Transferring error', error);
            response.error = {message: error.message};
        }

        event.sender.send(IpcEvents.device.saveUserConfigurationReply, response);
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
