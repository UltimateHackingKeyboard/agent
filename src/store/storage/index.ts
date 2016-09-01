import { Injectable } from '@angular/core';
import { Local } from './local';
import { Electron } from './electron';

@Injectable()
export class DataStorage {

    private _environment: Local | Electron;

    constructor() {
        this.detectEnviorment();
    }

    initialState() {
        return this._environment.initialState();
    }

    detectEnviorment() {
        // Electron
        // TODO check if we can remove <any> when electron will be implemented (maybe use process.versions['electron'])
        if (typeof window !== 'undefined' && (<any>window).process && (<any>window).process.type === 'renderer') {
             this._environment = new Electron();
        }
        // Local storage
        else {
            this._environment = new Local();
        }
    }
}
