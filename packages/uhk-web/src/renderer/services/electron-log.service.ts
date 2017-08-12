import { Injectable } from '@angular/core';
import * as log from 'electron-log';
import * as util from 'util';

import { LogService } from 'uhk-common';

/**
 * This service use the electron-log package to write log in file.
 * The logger usable in main and renderer process.
 * The location of the log files:
 * - on Linux: ~/.config/<app name>/log.log
 * - on OS X: ~/Library/Logs/<app name>/log.log
 * - on Windows: %USERPROFILE%\AppData\Roaming\<app name>\log.log
 * The app name: UHK Agent. The up to date value in the scripts/release.js file.
 */
@Injectable()
export class ElectronLogService implements LogService {
    private static getErrorText(args: any) {
        return util.inspect(args);
    }

    error(...args: any[]): void {
        log.error(ElectronLogService.getErrorText(args));
    }

    debug(...args: any[]): void {
        log.debug(ElectronLogService.getErrorText(args));
    }

    silly(...args: any[]): void {
        log.silly(ElectronLogService.getErrorText(args));
    }

    info(...args: any[]): void {
        log.info(ElectronLogService.getErrorText(args));
    }
}
