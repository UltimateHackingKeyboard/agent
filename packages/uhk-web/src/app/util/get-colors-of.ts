import { colord, extend, RgbColor } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import { RgbColorInterface } from 'uhk-common';
import { blackRgbColor } from './rgb-color-contants';

import { whiteRgbColor } from './rgb-color-contants';

extend([a11yPlugin]);

export interface Colors {
    asRgb: RgbColorInterface;
    // the original color in hex format
    backgroundColorAsHex: string;
    fontColorAsHex: string;
    hoverColorAsHex: string;
    invertColorAsHex: string;
    // svg colors are hex colors but # converted to %23
    svgFillColor: string;
    // svg colors are hex colors but # converted to %23
    svgStrokeColor: string;
}

const COLOR_MAP = new Map<string, Colors>();
const HOVER_COLOR_PERCENTAGE = 0.25;
export function getColorsOf(color: RgbColorInterface): Colors {
    if(!color) {
        return {
            asRgb: whiteRgbColor(),
            backgroundColorAsHex: '',
            fontColorAsHex: '',
            hoverColorAsHex: '',
            invertColorAsHex: '',
            svgFillColor: '',
            svgStrokeColor:''
        };
    }

    const key = generateKey(color);
    let cachedColor: Colors = COLOR_MAP.get(key);

    if (cachedColor) {
        return cachedColor;
    }

    const colored = colord(color);
    let fontColor = whiteRgbColor();
    let hoverColor = colored.lighten(HOVER_COLOR_PERCENTAGE);

    if (!colored.isReadable(fontColor)) {
        fontColor = blackRgbColor();
        hoverColor = colored.darken(HOVER_COLOR_PERCENTAGE);
    }

    cachedColor = {
        asRgb: colored.toRgb(),
        backgroundColorAsHex: colored.toHex(),
        fontColorAsHex: colord(fontColor).toHex(),
        hoverColorAsHex: hoverColor.toHex(),
        invertColorAsHex: colored.invert().toHex(),
        svgFillColor: colored.toHex().replace('#', '%23'),
        svgStrokeColor: colord(fontColor).toHex().replace('#', '%23')
    };

    COLOR_MAP.set(key, cachedColor);

    return cachedColor;
}

function generateKey (color: RgbColorInterface | RgbColor): string {
    return `r${color.r}g${color.g}b${color.b}`;
}
