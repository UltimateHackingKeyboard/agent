import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';
import { UserConfiguration } from '../../config-serializer/config-items/UserConfiguration';

import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';
import { Electron } from './electron';
import { Local } from './local';

@Injectable()
export class DataStorage {

    private _environment: Local | Electron;
    private defaultUserConfiguration: UserConfiguration;
    private uhkPresets: Keymap[];

    constructor() {
        this.initUHKJson();
        this.detectEnvironment();
    }

    initialState(): AppState {
        const config: UserConfiguration = this.getConfiguration();
        return {
            userConfiguration: config,
            presetKeymaps: this.uhkPresets
        };
    }

    detectEnvironment(): void {
        // Electron
        // TODO check if we can remove <any> when electron will be implemented (maybe use process.versions['electron'])
        if (typeof window !== 'undefined' && (<any>window).process && (<any>window).process.type === 'renderer') {
            this._environment = new Electron();
        }
        // Local storage
        else {
            this._environment = new Local(this.defaultUserConfiguration.dataModelVersion);
        }
    }

    // TODO: Add type for state
    saveState(reducer: any): (state: any, action: Action) => AppState {
        return (state: any, action: Action) => {
            const nextState = reducer(state, action);
            this._environment.saveConfig(nextState);
            return nextState;
        };
    }

    initUHKJson() {
        this.defaultUserConfiguration = new UserConfiguration()
            .fromJsonObject(require('json!../../config-serializer/user-config.json'));
        this.uhkPresets = (<any[]>require('json!../../config-serializer/preset-keymaps.json'))
            .map(keymap => new Keymap().fromJsonObject(keymap));
    }

    getConfiguration(): UserConfiguration {
        let config: UserConfiguration = this._environment.getConfig();
        if (!config) {
            config = this.defaultUserConfiguration;
        }
        return config;
    }
}
