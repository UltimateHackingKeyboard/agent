import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Keymaps } from '../../config-serializer/config-items/Keymaps';
import { Macro } from '../../config-serializer/config-items/Macro';
import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';

import { KeymapActions } from '../actions/keymap';
import { MacroActions } from '../actions/macro';
import { AppState } from '../index';

export class Local {
    initialState(): AppState {
        let config: UhkConfiguration;
        let presetAll: Keymaps;

        // Load data from json
        if (!localStorage.getItem('config')) {
            const jsonUser: JSON = require('json!../../config-serializer/uhk-config.json');
            const jsonPreset: any = require('json!../../config-serializer/preset-keymaps.json');
            config = new UhkConfiguration().fromJsObject(jsonUser);
            presetAll = new Keymaps().fromJsObject(jsonPreset.keymaps);

            // Save to local storage
            localStorage.setItem('config', JSON.stringify(config.toJsObject()));
            localStorage.setItem('preset', JSON.stringify(presetAll.toJsObject()));
        }
        // Load data from local storage
        else {
            config = new UhkConfiguration().fromJsObject(
                JSON.parse(localStorage.getItem('config'))
            );
            presetAll = new Keymaps().fromJsObject(
                JSON.parse(localStorage.getItem('preset'))
            );
        }

        return {
            keymap: config.keymaps.elements,
            macro: config.macros.elements,
            preset: presetAll.elements
        };
    }

    saveSate(reducer: any): (state: any, action: Action) => AppState {
        return function (state: any, action: Action) {
            let nextState = reducer(state, action);
            let config: UhkConfiguration;

            // Save elements to the UhkConfiguration
            if (action.type.startsWith(KeymapActions.PREFIX) && state.length && state[0] instanceof Keymap) {
                config = new UhkConfiguration().fromJsObject(
                    JSON.parse(localStorage.getItem('config'))
                );
                config.keymaps.elements = Object.values(nextState);
                localStorage.setItem('config', JSON.stringify(config.toJsObject()));
            } else if (action.type.startsWith(MacroActions.PREFIX) && state.length && state[0] instanceof Macro) {
                config = new UhkConfiguration().fromJsObject(
                    JSON.parse(localStorage.getItem('config'))
                );
                config.macros.elements = Object.values(nextState);
                localStorage.setItem('config', JSON.stringify(config.toJsObject()));
            }

            return nextState;
        };
    }
}
