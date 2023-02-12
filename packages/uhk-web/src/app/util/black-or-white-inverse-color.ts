import {colord, extend, RgbColor} from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

extend([a11yPlugin]);

export function whiteRgbColor(): RgbColor  {
    return {
        r: 255,
        g: 255,
        b: 255,
    };
}

export function blackRgbColor(): RgbColor  {
    return {
        r: 0,
        g: 0,
        b: 0,
    };
}

export function blackOrWhiteInverseColor(color: RgbColor): RgbColor {
    if (!color) {
        return whiteRgbColor();
    }

    if (colord(color).isReadable(whiteRgbColor()))
        return whiteRgbColor();

    return blackRgbColor();
}
