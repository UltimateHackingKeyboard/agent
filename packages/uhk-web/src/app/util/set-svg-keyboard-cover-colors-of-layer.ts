import { colord, extend } from 'colord';
import labPlugin from 'colord/plugins/lab';
import { BacklightingMode, Layer } from 'uhk-common';

import { uhkThemeColors } from './uhk-theme-colors';

extend([labPlugin]);

export function setSvgKeyboardCoverColorsOfLayer(backligtingMode: BacklightingMode, layer: Layer, theme: string): void {
    const themeColors = uhkThemeColors(theme);

    if (backligtingMode === BacklightingMode.PerKeyBacklighting) {
        const fillColord = colord('#cccccc');

        layer.svgKeyboardCoverColors = {
            fillColor: fillColord.toHex(),
            strokeColor: colord(themeColors.backgroundColor).delta(fillColord) < 0.01
                ? 'lightgray'
                : ''
        };
    } else {
        layer.svgKeyboardCoverColors = themeColors.svgKeyboardCoverColors;
    }
}
