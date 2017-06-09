import { ErrorHandler, Inject } from '@angular/core';
import { ILogService, LOG_SERVICE } from '../../../shared/src/services/logger.service';

export class ElectronErrorHandlerService implements ErrorHandler {
    constructor(@Inject(LOG_SERVICE)private logService: ILogService) {}

    handleError(error: any) {
        this.logService.error(error);
    }
}
