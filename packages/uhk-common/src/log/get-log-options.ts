import { CommandLineArgs } from '../models/command-line-args.js';
import { LogOptions } from '../models/log-options.js';
import { DEFAULT_LOG_OPTIONS } from './default-log-options.js';

export function getLogOptions(options: CommandLineArgs): LogOptions {
    if (!options.log) {
        return DEFAULT_LOG_OPTIONS;
    }

    if (options.log === 'none') {
        return {};
    }

    return options.log
        .split(',')
        .reduce((logOptions, category) => {
            switch (category) {
                case 'all':
                    logOptions.config = true;
                    logOptions.misc = true;
                    logOptions.usb = true;
                    logOptions.usbOps = true;
                    break;

                case 'config':
                    logOptions.config = true;
                    break;

                case 'misc':
                    logOptions.misc = true;
                    break;

                case 'usb':
                    logOptions.usb = true;
                    logOptions.usbOps = true;
                    break;

                case 'usbOps':
                    logOptions.usbOps = true;
                    break;

                default:
                    break;
            }

            return logOptions;
        }, {} as LogOptions);
}
