import {Injectable, InjectionToken} from '@angular/core';

export interface ILogService {

    error(...args: any[]): void;
    info(...args: any[]): void;
}

export let LOG_SERVICE = new InjectionToken('logger-service');

@Injectable()
export class ConsoleLogService implements ILogService {
    error(...args: any[]): void {
        console.error(args);
    }

    info(...args: any[]): void {
        console.info(args);
    }
}
