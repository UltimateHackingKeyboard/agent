import { ErrorHandler, Injectable } from '@angular/core';
import { LogService } from '../../app/services/logger.service';

@Injectable()
export class ElectronErrorHandlerService implements ErrorHandler {
    constructor(private logService: LogService) { }

    handleError(error: any) {
        this.logService.error(error);
    }
}
