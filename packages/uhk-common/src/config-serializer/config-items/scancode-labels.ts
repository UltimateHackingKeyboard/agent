import { KeyLanguage } from '../../models/key-language.js';
import SCANCODES from './scancodes.js';

export type ScancodeTexts = string[];

export interface ScancodeOptionChild {
    id: string;
    text: string;
    additional?: {
        type?: string;
        scancode?: number;
        explanation?: string;
    };
}

export interface ScancodeOptionGroup {
    text: string;
    children: ScancodeOptionChild[];
}

/**
 * US HID usage → label lines for keymap SVG rendering (unshifted [, shifted]).
 * Matches the previous MapperService US map.
 */
export const US_BASIC_SCANCODE_TEXTS: Readonly<Record<number, ScancodeTexts>> = {
    4: ['A'],
    5: ['B'],
    6: ['C'],
    7: ['D'],
    8: ['E'],
    9: ['F'],
    10: ['G'],
    11: ['H'],
    12: ['I'],
    13: ['J'],
    14: ['K'],
    15: ['L'],
    16: ['M'],
    17: ['N'],
    18: ['O'],
    19: ['P'],
    20: ['Q'],
    21: ['R'],
    22: ['S'],
    23: ['T'],
    24: ['U'],
    25: ['V'],
    26: ['W'],
    27: ['X'],
    28: ['Y'],
    29: ['Z'],
    30: ['1', '!'],
    31: ['2', '@'],
    32: ['3', '#'],
    33: ['4', '$'],
    34: ['5', '%'],
    35: ['6', '^'],
    36: ['7', '&'],
    37: ['8', '*'],
    38: ['9', '('],
    39: ['0', ')'],
    40: ['Enter'],
    41: ['Esc'],
    42: ['Backspace'],
    43: ['Tab'],
    44: ['Space'],
    45: ['-', '_'],
    46: ['=', '+'],
    47: ['[', '{'],
    48: [']', '}'],
    49: ['\\', '|'],
    50: ['ISO key', '#'],
    51: [';', ':'],
    52: ['\'', '"'],
    53: ['`', '~'],
    54: [',', '<'],
    55: ['.', '>'],
    56: ['/', '?'],
    57: ['Caps Lock'],
    58: ['F1'],
    59: ['F2'],
    60: ['F3'],
    61: ['F4'],
    62: ['F5'],
    63: ['F6'],
    64: ['F7'],
    65: ['F8'],
    66: ['F9'],
    67: ['F10'],
    68: ['F11'],
    69: ['F12'],
    70: ['PrtScn', 'SysRq'],
    71: ['ScrLk'],
    72: ['Pause'],
    73: ['Insert'],
    74: ['Home'],
    75: ['PgUp'],
    76: ['Del'],
    77: ['End'],
    78: ['PgDn'],
    79: ['Right Arrow'],
    80: ['Left Arrow'],
    81: ['Down Arrow'],
    82: ['Up Arrow'],
    83: ['NumLk'],
    84: ['Np /'],
    85: ['Np *'],
    86: ['Np -'],
    87: ['Np +'],
    88: ['Np Enter'],
    89: ['Np 1', 'End'],
    90: ['Np 2', 'icon-kbd__mod--arrow-down'],
    91: ['Np 3', 'PgDn'],
    92: ['Np 4', 'icon-kbd__mod--arrow-left'],
    93: ['Np 5'],
    94: ['Np 6', 'icon-kbd__mod--arrow-right'],
    95: ['Np 7', 'Home'],
    96: ['Np 8', 'icon-kbd__mod--arrow-up'],
    97: ['Np 9', 'PgUp'],
    98: ['Np 0', 'Insert'],
    99: ['Np .', 'Del'],
    100: ['ISO key', '|'],
    101: ['Menu'],
    104: ['F13'],
    105: ['F14'],
    106: ['F15'],
    107: ['F16'],
    108: ['F17'],
    109: ['F18'],
    110: ['F19'],
    111: ['F20'],
    112: ['F21'],
    113: ['F22'],
    114: ['F23'],
    115: ['F24'],
    135: ['Int1'],
    136: ['Int2'],
    137: ['Int3'],
    138: ['Int4'],
    139: ['Int5'],
    144: ['Lang1'],
    145: ['Lang2'],
    176: ['00'],
    177: ['000']
};

/**
 * Sparse overrides matching UHK UK / German / Nordic keycap legends (best effort).
 * Only unshifted/shifted top legends — not AltGr / side-printed Mod/Fn legends.
 */
export const KEY_LANGUAGE_OVERRIDES: Readonly<Record<KeyLanguage, Readonly<Record<number, ScancodeTexts>>>> = {
    [KeyLanguage.Us]: {},
    [KeyLanguage.Uk]: {
        31: ['2', '"'],
        32: ['3', '£'],
        50: ['#', '~'],
        52: ['\'', '@'],
        53: ['`', '¬'],
        100: ['\\', '|']
    },
    [KeyLanguage.German]: {
        28: ['Z'],
        29: ['Y'],
        31: ['2', '"'],
        32: ['3', '§'],
        35: ['6', '&'],
        36: ['7', '/'],
        37: ['8', '('],
        38: ['9', ')'],
        39: ['0', '='],
        45: ['ß', '?'],
        46: ['´', '`'],
        47: ['Ü'],
        48: ['+', '*'],
        50: ['#', '\''],
        51: ['Ö'],
        52: ['Ä'],
        53: ['^', '°'],
        54: [',', ';'],
        55: ['.', ':'],
        56: ['-', '_'],
        100: ['<', '>']
    },
    [KeyLanguage.Nordic]: {
        31: ['2', '"'],
        32: ['3', '#'],
        33: ['4', '¤'],
        35: ['6', '&'],
        36: ['7', '/'],
        37: ['8', '('],
        38: ['9', ')'],
        39: ['0', '='],
        45: ['+', '?'],
        46: ['´', '`'],
        47: ['Å'],
        48: ['¨', '^'],
        50: ['*', '\''],
        51: ['Ö', 'Ø'],
        52: ['Ä', 'Æ'],
        53: ['§', '½'],
        54: [',', ';'],
        55: ['.', ':'],
        56: ['-', '_'],
        100: ['<', '>']
    }
};

export function getBasicScancodeTexts(scancode: number, language: KeyLanguage = KeyLanguage.Us): ScancodeTexts | undefined {
    const override = KEY_LANGUAGE_OVERRIDES[language]?.[scancode];
    if (override) {
        return override;
    }

    return US_BASIC_SCANCODE_TEXTS[scancode];
}

export function formatScancodeDropdownText(texts: ScancodeTexts): string {
    return texts
        .filter(text => !text.startsWith('icon-'))
        .join(' ');
}

function getChildBasicScancode(child: ScancodeOptionChild): number | undefined {
    if (child.additional?.type && child.additional.type !== 'basic') {
        return undefined;
    }

    if (child.additional?.scancode != null) {
        return child.additional.scancode;
    }

    return Number.parseInt(child.id, 10);
}

/**
 * Returns scancode dropdown groups with labels for the given key language.
 * US keeps the existing SCANCODES wording; other languages apply legend overrides.
 */
export function getScancodesForKeyLanguage(language: KeyLanguage): ScancodeOptionGroup[] {
    const groups = SCANCODES as ScancodeOptionGroup[];

    if (language === KeyLanguage.Us) {
        return groups;
    }

    const overrides = KEY_LANGUAGE_OVERRIDES[language];

    return groups.map(group => ({
        ...group,
        children: group.children.map(child => {
            const scancode = getChildBasicScancode(child);
            if (scancode == null) {
                return child;
            }

            const texts = overrides[scancode];
            if (!texts) {
                return child;
            }

            return {
                ...child,
                text: formatScancodeDropdownText(texts)
            };
        })
    }));
}
