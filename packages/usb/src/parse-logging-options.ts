import { LogOptions } from 'uhk-common';

export function parseLoggingOptions(arg: string = ''): LogOptions {
    return arg.split(',')
        .reduce((logOptions, category) => {
            switch (category) {
                case 'all':
                    logOptions.config = true;
                    logOptions.misc = true;
                    logOptions.usb = true;
                    break;

                case 'config':
                    logOptions.config = true;
                    break;

                case 'misc':
                    logOptions.misc = true;
                    break;

                case 'usb':
                    logOptions.usb = true;
                    break;

                default:
                    break;
            }

            return logOptions;
        }, {} as LogOptions);

}
