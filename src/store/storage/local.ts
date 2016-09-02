import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Keymaps } from '../../config-serializer/config-items/Keymaps';
import { Macro } from '../../config-serializer/config-items/Macro';
import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';
import { AppState } from '../index';

export class Local {
    initialState(): AppState {
        let keymap: Keymap[];
        let macro: Macro[];
        let preset: Keymap[];

        // Load data from json
        if (!localStorage.getItem('config')) {
            const jsonUser: JSON = require('json!../../config-serializer/uhk-config.json');
            const jsonPreset: any = require('json!../../config-serializer/preset-keymaps.json');
            const config: UhkConfiguration = new UhkConfiguration().fromJsObject(jsonUser);
            const presetAll: Keymaps = new Keymaps().fromJsObject(jsonPreset.keymaps);

            keymap = config.keymaps.elements;
            macro = config.macros.elements;
            preset = presetAll.elements;

            // Save to local storage
            localStorage.setItem('config', JSON.stringify(config._toJsObject()));
            localStorage.setItem('preset', JSON.stringify(presetAll._toJsObject()));
        }
        // Load data from local storage
        else {
            const config: UhkConfiguration = new UhkConfiguration().fromJsObject(
                JSON.parse(localStorage.getItem('config'))
            );
            const presetAll: Keymaps = new Keymaps().fromJsObject(
                JSON.parse(localStorage.getItem('preset'))
            );

            keymap = config.keymaps.elements;
            macro = config.macros.elements;
            preset = presetAll.elements;
        }

        return {
            keymap: keymap,
            macro: macro,
            preset: preset
        };
    }
}
