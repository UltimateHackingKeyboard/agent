import { ErrorHandler, Injectable } from '@angular/core';
import { LogService } from 'uhk-common';

@Injectable()
export class ElectronErrorHandlerService implements ErrorHandler {
    constructor(private logService: LogService) { }

    handleError(error: any) {
        this.logService.error(error);
    }
}
