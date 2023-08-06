import { Keymap, UserConfiguration } from 'uhk-common';

import { setSvgKeyboardCoverColorsOfLayer } from './set-svg-keyboard-cover-colors-of-layer';

export function setSvgKeyboardCoverColorsOfAllLayer(userConfig: UserConfiguration, theme: string): void {
    userConfig.keymaps = userConfig.keymaps.map(keymap => {
        keymap = new Keymap(keymap);
        for (const layer of keymap.layers) {
            setSvgKeyboardCoverColorsOfLayer(userConfig.backlightingMode, layer, theme);
        }

        return keymap;
    });
}
