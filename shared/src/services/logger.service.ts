import { Injectable } from '@angular/core';

@Injectable()
export class LogService {
    error(...args: any[]): void {
        console.error(args);
    }

    info(...args: any[]): void {
        console.info(args);
    }
}
