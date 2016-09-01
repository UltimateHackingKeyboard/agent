import { UhkConfiguration } from '../../config-serializer/config-items/UhkConfiguration';
import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';
import { AppState } from '../index';

export class Local {
    initialState(): AppState {
        let keymap: Keymap[];
        let macro: Macro[];

        if (!localStorage.getItem('keymap')) {
            const json: JSON = require('json!../../config-serializer/uhk-config.json');
            const config: UhkConfiguration = new UhkConfiguration().fromJsObject(json);

            keymap = config.keymaps.elements;
            macro = config.macros.elements;
        } else {
            keymap = JSON.parse(localStorage.getItem('keymap'));
            macro = JSON.parse(localStorage.getItem('macro'));
        }

        return {
            keymap: keymap,
            macro: macro
        };
    }
}
