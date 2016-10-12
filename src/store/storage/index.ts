import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';
import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';
import { Electron } from './electron';
import { Local } from './local';

import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';
import { DataProviderService } from '../../services/data-provider.service';

@Injectable()
export class DataStorage {

    private _environment: Local | Electron;

    constructor(private dataProvider: DataProviderService) {
        this.detectEnvironment();
    }

    initialState(): AppState {
        let config: UhkConfiguration = this._environment.getConfig() || this.dataProvider.getUHKConfig();
        return {
            keymaps: {
                entities: config.keymaps
            },
            macros: {
                entities: config.macros
            },
            presetKeymaps: this.dataProvider.getDefaultKeymaps()
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
            this._environment = new Local(this.dataProvider);
        }
    }

    // TODO: Add type for state
    saveState(reducer: any): (state: any, action: Action) => AppState {
        return (state: any, action: Action) => {
            let nextState = reducer(state, action);
            let config: UhkConfiguration;

            // Save elements to the UhkConfiguration
            if (
                action.type.startsWith(KeymapActions.PREFIX) &&
                (
                    (nextState.entities && nextState.entities.length && nextState.entities[0] instanceof Keymap) ||
                    (state.entities && state.entities.length && state.entities[0] instanceof Keymap)
                )
            ) {
                config = this._environment.getConfig();
                config.keymaps = Object.values(nextState.entities);
                this._environment.saveConfig(config);
            } else if (
                action.type.startsWith(MacroActions.PREFIX) &&
                (
                    (nextState.entities && nextState.entities.length && nextState.entities[0] instanceof Macro) ||
                    (state.entities && state.entities.length && state.entities[0] instanceof Macro)
                )
            ) {
                config = this._environment.getConfig();
                config.macros = Object.values(nextState.entities);
                this._environment.saveConfig(config);
            }
            return nextState;
        };
    }
}
