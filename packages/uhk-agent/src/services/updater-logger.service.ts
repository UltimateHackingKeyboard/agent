import { LogService } from 'uhk-common';

export class UpdaterLoggerService {
    constructor(private logService: LogService) {
    }

    debug(message: any): void {
        this.logService.misc(message);
    }

    error(message: any): void {
        this.logService.error(message);
    }

    info(message: any): void {
        this.logService.misc(message);
    }

    warn(message: any): void {
        this.logService.misc(message);
    }
}
