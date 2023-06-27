import { SvgKeyboardCoverColors } from 'uhk-common';

export interface UhkThemeColors {
    backgroundColor: string;
    svgKeyboardCoverColors: SvgKeyboardCoverColors;
}
export function uhkThemeColors(theme = (window as any).getUhkTheme()): UhkThemeColors {
    if (theme === 'dark') {
        return {
            backgroundColor: '#000',
            svgKeyboardCoverColors: {
                fillColor: '#333',
                strokeColor: ''
            }
        };
    }

    return {
        backgroundColor: '#fff',
        svgKeyboardCoverColors: {
            fillColor: '#333',
            strokeColor: ''
        }
    };
}
