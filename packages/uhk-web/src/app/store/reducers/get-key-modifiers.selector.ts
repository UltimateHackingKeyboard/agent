import { createSelector } from '@ngrx/store';
import { KeyModifiers, KeyModifierSymbols, KeyModifierValues } from 'uhk-common';

import { OperationSystem } from '../../models/operation-system';
import { getOperationSystem } from './get-operation-system.selector';

export const getKeyModifiers = createSelector(getOperationSystem, (os: OperationSystem): KeyModifiers => {
    switch (os) {
        case OperationSystem.Mac:
            return {
                lefts: [
                    {
                        buttonGroupText: 'LShift',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Shift'
                        },
                        value: KeyModifierValues.leftShift,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-shift'
                        }
                    },
                    {
                        buttonGroupText: 'LCtrl',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Ctrl'
                        },
                        value: KeyModifierValues.leftCtrl,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'C'
                        }
                    },
                    {
                        buttonGroupText: 'LCmd',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Cmd'
                        },
                        value: KeyModifierValues.leftGui,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-command'
                        }
                    },
                    {
                        buttonGroupText: 'LOption',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Option'
                        },
                        value: KeyModifierValues.leftAlt,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-option'
                        }
                    }
                ],
                rights: [
                    {
                        buttonGroupText: 'RShift',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Shift'
                        },
                        value: KeyModifierValues.rightShift,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-shift'
                        }
                    },
                    {
                        buttonGroupText: 'RCtrl',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Ctrl'
                        },
                        value: KeyModifierValues.rightCtrl,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'C'
                        }
                    },
                    {
                        buttonGroupText: 'RCmd',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Cmd'
                        },
                        value: KeyModifierValues.rightGui,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-command'
                        }
                    },
                    {
                        buttonGroupText: 'ROption',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Option'
                        },
                        value: KeyModifierValues.rightAlt,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-option'
                        }
                    }
                ]
            };

        case OperationSystem.Windows:
            return {
                lefts: [
                    {
                        buttonGroupText: 'LShift',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Shift'
                        },
                        value: KeyModifierValues.leftShift,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-shift'
                        }
                    },
                    {
                        buttonGroupText: 'LCtrl',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Ctrl'
                        },
                        value: KeyModifierValues.leftCtrl,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'C'
                        }
                    },
                    {
                        buttonGroupText: 'LWindows',
                        keyText: {
                            type: KeyModifierSymbols.icon,
                            value: 'kbd__default--modifier-windows'
                        },
                        value: KeyModifierValues.leftGui,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'W'
                        }
                    },
                    {
                        buttonGroupText: 'LAlt',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Alt'
                        },
                        value: KeyModifierValues.leftAlt,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'A'
                        }
                    }
                ],
                rights: [
                    {
                        buttonGroupText: 'RShift',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Shift'
                        },
                        value: KeyModifierValues.rightShift,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-shift'
                        }
                    },
                    {
                        buttonGroupText: 'RCtrl',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Ctrl'
                        },
                        value: KeyModifierValues.rightCtrl,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'C'
                        }
                    },
                    {
                        buttonGroupText: 'RWindows',
                        keyText: {
                            type: KeyModifierSymbols.icon,
                            value: 'kbd__default--modifier-windows'
                        },
                        value: KeyModifierValues.rightGui,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'W'
                        }
                    },
                    {
                        buttonGroupText: 'RAlt',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Alt'
                        },
                        value: KeyModifierValues.rightAlt,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'A'
                        }
                    }
                ]
            };

        default:
            return {
                lefts: [
                    {
                        buttonGroupText: 'LShift',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Shift'
                        },
                        value: KeyModifierValues.leftShift,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-shift'
                        }
                    },
                    {
                        buttonGroupText: 'LCtrl',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Ctrl'
                        },
                        value: KeyModifierValues.leftCtrl,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'C'
                        }
                    },
                    {
                        buttonGroupText: 'LSuper',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Super'
                        },
                        value: KeyModifierValues.leftGui,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'S'
                        }
                    },
                    {
                        buttonGroupText: 'LAlt',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Alt'
                        },
                        value: KeyModifierValues.leftAlt,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'A'
                        }
                    }
                ],
                rights: [
                    {
                        buttonGroupText: 'RShift',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Shift'
                        },
                        value: KeyModifierValues.rightShift,
                        symbol: {
                            type: KeyModifierSymbols.icon,
                            value: 'icon-kbd__default--modifier-shift'
                        }
                    },
                    {
                        buttonGroupText: 'RCtrl',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Ctrl'
                        },
                        value: KeyModifierValues.rightCtrl,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'C'
                        }
                    },
                    {
                        buttonGroupText: 'RSuper',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Super'
                        },
                        value: KeyModifierValues.rightGui,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'S'
                        }
                    },
                    {
                        buttonGroupText: 'RAlt',
                        keyText: {
                            type: KeyModifierSymbols.charachter,
                            value: 'Alt'
                        },
                        value: KeyModifierValues.rightAlt,
                        symbol: {
                            type: KeyModifierSymbols.charachter,
                            value: 'A'
                        }
                    }
                ]
            };
    }
});
