import { UhkThemeColors } from 'uhk-common';

export function defaultUhkThemeColors(theme = (window as any).getUhkTheme()): UhkThemeColors {
    if (theme === 'dark') {
        return {
            backgroundColor: '#111',
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
