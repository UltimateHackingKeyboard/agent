import { UhkThemeColors } from 'uhk-common';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defaultUhkThemeColors(theme = (window as any).getUhkTheme()): UhkThemeColors {
    if (theme === 'dark') {
        return {
            backgroundColor: '#111',
            selectedKeyColor: '#3ec9e8',
            selectedKeyColor2: '#d9534f',
            svgKeyboardCoverColors: {
                fillColor: '#333',
                strokeColor: ''
            }
        };
    }

    return {
        backgroundColor: '#fff',
        selectedKeyColor: '#337ab7',
        selectedKeyColor2: '#d9534f',
        svgKeyboardCoverColors: {
            fillColor: '#333',
            strokeColor: ''
        }
    };
}
