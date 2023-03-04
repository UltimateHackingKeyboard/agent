import { SvgKeyboardCoverColors } from 'uhk-common';

export interface UhkThemeColors {
    backgroundColor: string;
    svgKeyboardCoverColors: SvgKeyboardCoverColors;
}
export function uhkThemeColors(): UhkThemeColors {
    if ((window as any).getUhkTheme() === 'dark') {
        return {
            backgroundColor: '#000',
            svgKeyboardCoverColors: {
                fillColor: '#111',
                strokeColor: 'lightgray'
            }
        };
    }

    return {
        backgroundColor: '#fff',
        svgKeyboardCoverColors: {
            fillColor: '#333',
            strokeColor: 'lightgray'
        }
    };
}
