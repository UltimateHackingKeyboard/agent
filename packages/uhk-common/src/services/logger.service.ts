import { LogOptions } from '../models';

export const DEFAULT_LOG_OPTIONS: LogOptions = {
    misc: true
};

export class LogService {

    protected _options = DEFAULT_LOG_OPTIONS;

    setLogOptions(options: LogOptions): void {
        this._options = options;
    }

    config(...args: any[]): void {
        if (!this._options.config) {
            return;
        }

        this.log(...args);
    }

    error(...args: any[]): void {
        console.error(...args);
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

    protected log(...args: any[]): void {
        console.log(...args);
    }
}
