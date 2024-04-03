import { SvgKeyboardCoverColors } from './svg-keyboard-cover-colors.js';

export interface UhkThemeColors {
    backgroundColor: string;
    selectedKeyColor: string;
    // if perKeyColor is enabled, this color will be used when selectedKeyColor and key color contrast is too low
    selectedKeyColor2: string;
    svgKeyboardCoverColors: SvgKeyboardCoverColors;
}
