import { BacklightingMode, Keymap } from 'uhk-common';

import { setSvgKeyboardCoverColorsOfLayer } from './set-svg-keyboard-cover-colors-of-layer';

export function setSvgKeyboardCoverColorsOfKeymapLayers(backligtingMode: BacklightingMode, keymap: Keymap, theme: string): Keymap {
    keymap = new Keymap(keymap);
    for (const layer of keymap.layers) {
        setSvgKeyboardCoverColorsOfLayer(backligtingMode, layer, theme);
    }

    return keymap
}
