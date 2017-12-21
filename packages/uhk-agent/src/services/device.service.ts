import { ipcMain } from 'electron';
import { ConfigurationReply, IpcEvents, IpcResponse, LogService } from 'uhk-common';
import { Constants, snooze, UhkHidDevice, UhkOperations } from 'uhk-usb';
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
import { QueueManager } from './queue-manager';

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
    private queueManager = new QueueManager();

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow,
                private device: UhkHidDevice,
                private operations: UhkOperations) {
        this.pollUhkDevice();

        ipcMain.on(IpcEvents.device.saveUserConfiguration, (...args: any[]) => {
            this.queueManager.add({
                method: this.saveUserConfiguration,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.loadConfigurations, (...args: any[]) => {
            this.queueManager.add({
                method: this.loadConfigurations,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

        ipcMain.on(IpcEvents.device.updateFirmware, (...args: any[]) => {
            this.queueManager.add({
                method: this.updateFirmware,
                bind: this,
                params: args,
                asynchronous: true
            });
        });

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
            const result = await this.operations.loadConfigurations();

            response = {
                success: true,
                ...result
            };
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

    public close(): void {
        this.connected = false;
        this.stopPollTimer();
        this.logService.info('[DeviceService] Device connection checker stopped.');
    }

    public async updateFirmware(event: Electron.Event, args?: Array<string>): Promise<void> {
        const response = new IpcResponse();
        let firmwarePathData: TmpFirmware;

        try {
            this.stopPollTimer();

            if (args && args.length > 0) {
                firmwarePathData = await saveTmpFirmware(args[0]);
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
            .do(async (connected: boolean) => {
                if (!await this.device.hasPermission()) {
                    return;
                }

                this.connected = connected;
                this.win.webContents.send(IpcEvents.device.deviceConnectionStateChanged, connected);
                this.logService.info(`[DeviceService] Device connection state changed to: ${connected}`);
            })
            .subscribe();
    }

    private async saveUserConfiguration(event: Electron.Event, args: Array<string>): Promise<void> {
        const response = new IpcResponse();
        const json = args[0];

        try {
            await this.operations.saveUserConfiguration(json);

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

    private stopPollTimer(): void {
        if (!this.pollTimer$) {
            return;
        }

        this.pollTimer$.unsubscribe();
        this.pollTimer$ = null;

    }
}
