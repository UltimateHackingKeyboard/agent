import { RgbColorInterface } from './rgb-color-interface.js';

export function initBacklightingColorPalette(): Array<RgbColorInterface> {
    return [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 }
    ];
}
