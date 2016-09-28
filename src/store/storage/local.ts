import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';
import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';

import { KeymapActions, MacroActions } from '../actions';
import { AppState } from '../index';

export class Local {
    initialState(): AppState {
        let config: UhkConfiguration;
        let presetAll: Keymap[];

        // Load data from json
        if (!localStorage.getItem('config')) {
            const jsonUser: JSON = require('json!../../config-serializer/uhk-config.json');
            const presets: any[] = require('json!../../config-serializer/preset-keymaps.json');
            config = new UhkConfiguration().fromJsObject(jsonUser);
            presetAll = presets.map(keymap => new Keymap().fromJsObject(keymap));

            // Save to local storage
            localStorage.setItem('config', JSON.stringify(config.toJsObject()));
            localStorage.setItem('preset', JSON.stringify(presetAll.map(preset => preset.toJsObject())));
        }
        // Load data from local storage
        else {
            config = new UhkConfiguration().fromJsObject(
                JSON.parse(localStorage.getItem('config'))
            );
            presetAll = JSON.parse(localStorage.getItem('preset')).map((keymap: any) => new Keymap().fromJsObject(keymap));
        }

        return {
            keymaps: {
                entities: config.keymaps
            },
            macros: {
                entities: config.macros
            },
            presetKeymaps: presetAll
        };
    }

    saveSate(reducer: any): (state: any, action: Action) => AppState {
        return function (state: any, action: Action) {
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
                config = new UhkConfiguration().fromJsObject(
                    JSON.parse(localStorage.getItem('config'))
                );
                config.keymaps = Object.values(nextState.entities);
                localStorage.setItem('config', JSON.stringify(config.toJsObject()));
            } else if (
                action.type.startsWith(MacroActions.PREFIX) &&
                (
                    (nextState.entities && nextState.entities.length && nextState.entities[0] instanceof Macro) ||
                    (state.entities && state.entities.length && state.entities[0] instanceof Macro)
                )
            ) {
                config = new UhkConfiguration().fromJsObject(
                    JSON.parse(localStorage.getItem('config'))
                );
                config.macros = Object.values(nextState.entities);
                localStorage.setItem('config', JSON.stringify(config.toJsObject()));
            }

            return nextState;
        };
    }
}
