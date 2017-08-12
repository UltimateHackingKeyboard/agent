import { ipcMain, BrowserWindow } from 'electron';

import { Constants, IpcEvents, LogService, IpcResponse } from 'uhk-common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Device, devices, HID } from 'node-hid';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';

enum Command {
    UploadConfig = 8,
    ApplyConfig = 9
}

export class DeviceService {
    private static convertBufferToIntArray(buffer: Buffer): number[] {
        return Array.prototype.slice.call(buffer, 0);
    }

    private pollTimer$: Subscription;
    private connected: boolean = false;

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow) {
        this.pollUhkDevice();
        ipcMain.on(IpcEvents.device.saveUserConfiguration, this.saveUserConfiguration.bind(this));
        logService.info('DeviceService init success');
    }

    public get isConnected(): boolean {
        return this.connected;
    }

    public hasPermission(): boolean {
        try {
            const devs = devices();
            return true;
        } catch (err) {
            this.logService.error('[DeviceService] hasPermission', err);
        }

        return false;
    }

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * Every second check the HID device list.
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

    private saveUserConfiguration(event: Electron.Event, json: string): void {
        const response = new IpcResponse();

        try {
            const buffer: Buffer = new Buffer(JSON.parse(json).data);
            const fragments = this.getTransferBuffers(buffer);
            const device = this.getDevice();

            for (const fragment of fragments) {
                const transferData = this.getTransferData(fragment);
                this.logService.debug('Fragment: ', JSON.stringify(transferData));
                device.write(transferData);
            }

            const applyBuffer = new Buffer([Command.ApplyConfig]);
            const applyTransferData = this.getTransferData(applyBuffer);
            this.logService.debug('Fragment: ', JSON.stringify(applyTransferData));
            device.write(applyTransferData);

            response.success = true;
            this.logService.info('transferring finished');
        }
        catch (error) {
            this.logService.error('transferring error', error);
            response.error = { message: error.message };
        }

        event.sender.send(IpcEvents.device.saveUserConfigurationReply, response);
    }

    private getTransferData(buffer: Buffer): number[] {
        const data = DeviceService.convertBufferToIntArray(buffer);
        // if data start with 0 need to add additional leading zero because HID API remove it.
        // https://github.com/node-hid/node-hid/issues/187
        if (data.length > 0 && data[0] === 0) {
            data.unshift(0);
        }

        // From HID API documentation:
        // http://www.signal11.us/oss/hidapi/hidapi/doxygen/html/group__API.html#gad14ea48e440cf5066df87cc6488493af
        // The first byte of data[] must contain the Report ID.
        // For devices which only support a single report, this must be set to 0x0.
        data.unshift(0);

        return data;
    }

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

    /**
     * Return the 0 interface of the keyboard.
     * @returns {HID}
     */
    private getDevice(): HID {
        try {
            const devs = devices();
            this.logService.silly('Available devices:', devs);

            const dev = devs.find((x: Device) =>
                x.vendorId === Constants.VENDOR_ID &&
                x.productId === Constants.PRODUCT_ID &&
                ((x.usagePage === 128 && x.usage === 129) || x.interface === 0));

            if (!dev) {
                this.logService.info('[DeviceService] UHK Device not found:');
                return null;
            }
            const device = new HID(dev.path);
            this.logService.info('Used device:', dev);
            return device;
        }
        catch (err) {
            this.logService.error('Can not create device:', err);
        }

        return null;
    }

}
