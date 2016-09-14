import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';

import { AppState } from '../index';
import { Electron } from './electron';
import { Local } from './local';

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

    saveSate(reducer: any): (state: AppState, action: Action) => AppState {
        return this._environment.saveSate(reducer);
    }
}
