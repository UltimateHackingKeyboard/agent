import { Injectable } from '@angular/core';
import * as log from 'electron-log';
import * as util from 'util';

import { LogService } from 'uhk-common';

const transferRegExp = /USB\[T]:/;
const writeRegExp = /USB\[W]:/;
const readRegExp = /USB\[R]: 00/;
const errorRegExp = /(?:(USB\[R]: ([^0]|0[^0])))/;

// https://github.com/megahertz/electron-log/issues/44
// console.debug starting with Chromium 58 this method is a no-op on Chromium browsers.
if (console.debug) {
    console.debug = (...args: any[]): void => {
        if (writeRegExp.test(args[0])) {
            console.log('%c' + args[0], 'color:blue');
        } else if (readRegExp.test(args[0])) {
            console.log('%c' + args[0], 'color:green');
        } else if (errorRegExp.test(args[0])) {
            console.log('%c' + args[0], 'color:red');
        }else if (transferRegExp.test(args[0])) {
            console.log('%c' + args[0], 'color:orange');
        } else {
            console.log(...args);
        }
    };
}

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
    public static getErrorText(args: any) {
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
