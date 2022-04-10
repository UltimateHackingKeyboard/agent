import { Keymap } from './config-items/keymap.js';
import { UnresolvedSwitchKeymapAction } from './config-items/key-action/switch-keymap-action.js';

export namespace ConfigSerializer {

    export function resolveSwitchKeymapActions(keymaps: Keymap[]) {
        for (const keymap of keymaps) {
            for (const layer of keymap.layers) {
                for (const module of layer.modules) {
                    for (let i = 0; i < module.keyActions.length; ++i) {
                        const keyAction = module.keyActions[i];
                        if (keyAction instanceof UnresolvedSwitchKeymapAction) {
                            module.keyActions[i] = keyAction.resolve(keymaps);
                        }
                    }
                }
            }
        }
    }
}
