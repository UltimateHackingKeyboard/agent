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

export class DeviceService {
    private pollTimer$: Subscription;
    private connected: boolean = false;

    constructor(private logService: LogService,
                private win: Electron.BrowserWindow) {
        this.pollUhkDevice();
        ipcMain.on(IpcEvents.device.saveUserConfiguration, this.saveUserConfiguration.bind(this));
    }

    public get isConnected() {
        return this.connected;
    }

    public hasPermission() {
        return this.getDevice() !== null;
    }

    /**
     * HID API not support device attached and detached event.
     * This method check the keyboard is attached to the computer or not.
     * Every second check the HID device list.
     */
    private pollUhkDevice() {
        this.pollTimer$ = Observable.interval(1000)
            .startWith(0)
            .map(() => {
                return devices().some((dev: Device) => dev.vendorId === Constants.VENDOR_ID &&
                    dev.productId === Constants.PRODUCT_ID);
            })
            .distinctUntilChanged()
            .do((connected: boolean) => {
                this.logService.info(`Device connection state changed to: ${connected}`);
                this.connected = connected;
                this.win.webContents.send(IpcEvents.device.deviceConnectionStateChanged, connected);
            })
            .subscribe();
    }

    private saveUserConfiguration(event: Electron.Event, buffer: Buffer) {
        const data = Array.prototype.slice.call(buffer, 0);
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

        const response = new IpcResponse();

        try {
            const device = this.getDevice();
            device.write(data);
            response.success = true;
            this.logService.info('transfering finished');
        }
        catch (error) {
            this.logService.error('transfering errored', error);
            response.error = error;
        }

        event.sender.send(IpcEvents.device.saveUserConfigurationReply, response);
    }

    /**
     * Return the 0 interface of the keyboard.
     * @returns {HID}
     */
    private getDevice(): HID {
        try {
            const devs = devices();
            this.logService.info('Available devices:', devs);

            const dev = devs.find((x: Device) =>
                x.vendorId === Constants.VENDOR_ID &&
                x.productId === Constants.PRODUCT_ID &&
                ((x.usagePage === 128 && x.usage === 129) || x.interface === 0));

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
