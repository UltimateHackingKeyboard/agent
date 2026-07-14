/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogOptions } from '../models/log-options.js';
import { UserConfiguration } from '../config-serializer/config-items/user-configuration.js';
import { logUserConfigHelper } from './log-user-config-helper.js';
import { DEFAULT_LOG_OPTIONS } from './default-log-options.js';

export class LogService {

    protected _options = DEFAULT_LOG_OPTIONS;
    protected _usbReportId: number = 0;

    setLogOptions(options: LogOptions): void {
        this._options = options;
    }

    setUsbReportId(reportId: number): void {
        this._usbReportId = reportId;
    }

    config(message: string, config: UserConfiguration | string | Object): void {
        if (!this._options.config) {
            return;
        }

        logUserConfigHelper(this.log, message, config);
    }

    error(...args: any[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        console.error(...args);
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
        console.log(...args);
    }
}
