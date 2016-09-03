import { Keymaps } from '../../config-serializer/config-items/Keymaps';
import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';
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
}
