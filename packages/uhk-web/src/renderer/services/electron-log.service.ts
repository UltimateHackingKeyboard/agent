import * as path from 'path';
import { Injectable } from '@angular/core';
import * as log from 'electron-log';
import { LogService, logUserConfigHelper, UserConfiguration } from 'uhk-common';

log.transports.file.resolvePath = variables => {
    return path.join(variables.libraryDefaultDir, 'uhk-agent.log');
};
log.transports.file.level = 'silly';
log.transports.ipc.level = 'silly';

/**
 * This service use the electron-log package to write log in file.
 * The logger usable in main and renderer process.
 * The location of the log files:
 * - on Linux: ~/.config/<app name>/uhk-agent.log
 * - on OS X: ~/Library/Logs/<app name>/uhk-agent.log
 * - on Windows: %USERPROFILE%\AppData\Roaming\<app name>\uhk-agent.log
 * The app name: UHK Agent. The up to date value in the scripts/release.js file.
 */
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

    protected log(...args: any[]): void {
        log.log(...args);
    }
}
