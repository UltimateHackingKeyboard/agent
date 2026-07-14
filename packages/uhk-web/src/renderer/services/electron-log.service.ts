/* eslint-disable @typescript-eslint/no-explicit-any */

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        log.error(...args);
    }

    misc(...args: any[]): void {
        if (!this._options.misc) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.log(...args);
    }

    usb(...args: any[]): void {
        if (!this._options.usb) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.log(...args);
    }

    usbOps(...args: any[]): void {
        if (!this._options.usbOps) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.log(...args);
    }

    protected log(...args: any[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        log.log(...args);
    }
}
