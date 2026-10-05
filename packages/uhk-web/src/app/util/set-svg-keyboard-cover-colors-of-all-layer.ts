import { UserConfiguration } from 'uhk-common';

import { setSvgKeyboardCoverColorsOfKeymapLayers } from './set-svg-keyboard-cover-colors-of-keymap-layers';


export function setSvgKeyboardCoverColorsOfAllLayer(userConfig: UserConfiguration, theme: string): void {
    userConfig.keymaps = userConfig.keymaps.map(keymap => {
        return setSvgKeyboardCoverColorsOfKeymapLayers(userConfig.backlightingMode, keymap, theme);
    });
}
