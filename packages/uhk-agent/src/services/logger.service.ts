import * as path from 'path';
import * as log from 'electron-log/main';
import { logUserConfigHelper, LogService, LogRegExps, UserConfiguration } from 'uhk-common';

/**
 * This service use the electron-log package to write log in file.
 * The logger usable in main and renderer process.
 * The location of the log files:
 * - on Linux: ~/.config/<app name>/uhk-agent.log
 * - on OS X: ~/Library/Logs/<app name>/uhk-agent.log
 * - on Windows: %USERPROFILE%\AppData\Roaming\<app name>\uhk-agent.log
 * The app name: UHK Agent. The up to date value in the scripts/release.js file.
 */
log.initialize({})
log.transports.console.level = 'silly';
log.transports.file.level = 'silly';
log.transports.ipc.level = 'silly';
log.transports.file.resolvePathFn = variables => {
    return path.join(variables.libraryDefaultDir, 'uhk-agent.log');
};

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

        if (LogRegExps.writeRegExp.test(args[0])) {
            this.log('%c' + args.join(' '), 'color:blue');
        } else if (LogRegExps.readRegExp.test(args[0])) {
            let errorCodeStartIndex = 0;
            let errorCodeEndIndex = 2;

            if (this._usbReportId) {
                errorCodeStartIndex = 3;
                errorCodeEndIndex = 5;
            }

            if (args[1] && args[1].substring(errorCodeStartIndex, errorCodeEndIndex) === '00') {
                this.log('%c' + args.join(' '), 'color:green');
            } else {
                this.log('%c' + args.join(' '), 'color:red');
            }
        } else {
            this.log(...args);
        }
    }

    usbOps(...args) {
        if (!this._options.usbOps) {
            return;
        }

        this.log('%c' + args.join(' '), 'color:orange');
    }

    protected log(...args: any[]): void {
        log.log(...args);
    }
}
