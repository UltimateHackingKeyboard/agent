import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LogService } from 'uhk-common';

@Injectable()
export class ElectronErrorHandlerService implements ErrorHandler {
    private readonly logService = inject(LogService);

    handleError(error: unknown) {
        this.logService.error(error);
    }
}
