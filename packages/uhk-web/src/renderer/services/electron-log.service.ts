import { Injectable } from '@angular/core';
import * as log from 'electron-log/renderer';
import { LogService, logUserConfigHelper, UserConfiguration } from 'uhk-common';

@Injectable()
export class ElectronLogService extends LogService {

    config(message: string, config: UserConfiguration | string): void {
        if (!this._options.config) {
            return;
        }

        logUserConfigHelper(this.log, message, config);
    }

    error(...args: any[]): void {
        log.error(...args);
    }

    misc(...args: any[]): void {
        if (!this._options.misc) {
            return;
        }

        this.log(...args);
    }

    usb(...args: any[]): void {
        if (!this._options.usb) {
            return;
        }

        this.log(...args);
    }

    usbOps(...args: any[]): void {
        if (!this._options.usbOps) {
            return;
        }

        this.log(...args);
    }

    protected log(...args: any[]): void {
        log.log(...args);
    }
}
