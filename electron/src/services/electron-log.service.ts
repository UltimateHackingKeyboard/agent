import { Injectable } from '@angular/core';
import * as log from 'electron-log';

import { ILogService } from '../../../shared/src/services/logger.service';

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
export class ElectronLogService implements ILogService {
    private static getErrorText(args: any) {
        const json: any = Array.from(args).map(x => {
            if (x instanceof Array) {
                return ElectronLogService.getErrorText(x);
            }

            if (typeof x === 'string' ||
                typeof x === 'number' ||
                typeof x === 'boolean') {
                return x;
            }

            if (x instanceof Error) {
                return `${x.message}\n${x.stack}`;
            }

            return JSON.stringify(x, Object.getOwnPropertyNames(x));
        });

        return json.join('\n');
    }

    error(...args: any[]): void {
        log.error(ElectronLogService.getErrorText(args));
    }

    info(...args: any[]): void {
        log.info(ElectronLogService.getErrorText(args));
    }
}
