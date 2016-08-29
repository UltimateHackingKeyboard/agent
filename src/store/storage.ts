import {UhkConfiguration} from '../config-serializer/config-items/UhkConfiguration';

export class Storage {

    public static initialState() {

        // TODO move to the functtion and add logic for electron and localstorage
        const json: JSON = require('json!../config-serializer/uhk-config.json');
        const config: UhkConfiguration = new UhkConfiguration().fromJsObject(json);

        return {
            keymap: config.keymaps.elements
        };
    }
}
