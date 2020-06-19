import { LogService } from 'uhk-common';

export function getUpdaterLoggerService(logService: LogService) {
    return {
        debug: (message: any): void => {
            logService.misc(message);
        },
        error: (message: any): void => {
            logService.error(message);
        },
        info: (message: any): void =>  {
            logService.misc(message);
        },
        warn: (message: any): void =>  {
            logService.misc(message);
        }
    };
}
