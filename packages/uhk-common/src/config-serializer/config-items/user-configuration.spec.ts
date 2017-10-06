import { UserConfiguration } from './user-configuration';

describe('user-configuration', () => {
    it('should be instantiate', () => {
        const config = new UserConfiguration();
        expect(config).toBeTruthy();
    });

    it('should transform an empty config', () => {
        jsonTester({
            dataModelVersion: 1,
            moduleConfigurations: [],
            macros: [],
            keymaps: []
        });
    });

    it('should transform a null keyActionType ', () => {
        jsonTester({
            dataModelVersion: 1,
            moduleConfigurations: [],
            macros: [],
            keymaps: [
                {
                    isDefault: true,
                    abbreviation: 'QWR',
                    name: 'QWERTY',
                    description: '',
                    layers: [{
                        modules: [{
                            id: 0,
                            pointerRole: 'move',
                            keyActions: [
                                null
                            ]
                        }]
                    }]
                }
            ]
        });
    });

    xit('', () => {
        jsonTester({
            dataModelVersion: 1,
            moduleConfigurations: [],
            macros: [],
            keymaps: [
                {
                    isDefault: false,
                    abbreviation: '1HA',
                    name: 'ONE-HANDED',
                    description: '',
                    layers: [
                        {
                            modules: [
                                {
                                    id: 0,
                                    pointerRole: 'move',
                                    keyActions: [
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 36
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 37
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 38
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 39
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 45
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 46
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 42
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 24
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 12
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 18
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 19
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 47
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 48
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 49
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 28
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 13
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 14
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 15
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 51
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mouse',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 40
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 11
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 17
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 16
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 54
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 55
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 56
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 32
                                        },
                                        null,
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 44
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 64
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 128
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 16
                                        }
                                    ]
                                },
                                {
                                    id: 1,
                                    pointerRole: 'move',
                                    keyActions: [
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 53
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 30
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 31
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 32
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 33
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 34
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 35
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 43
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 20
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 26
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 8
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 21
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 23
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mouse',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 4
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 22
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 7
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 9
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 10
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 2
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 29
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 27
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 6
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 25
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 5
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 1
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 8
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 4
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 44
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        null
                                    ]
                                },
                                {
                                    id: 2,
                                    pointerRole: 'scroll',
                                    keyActions: []
                                }
                            ]
                        },
                        {
                            modules: [
                                {
                                    id: 0,
                                    pointerRole: 'none',
                                    keyActions: [
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 35
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 34
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 33
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 32
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 31
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 30
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 53
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 21
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 8
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 26
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 20
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 43
                                        },
                                        null,
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 23
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 9
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 7
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 22
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 4
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 19
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 10
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 5
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 25
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 6
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 27
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 29
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 32
                                        },
                                        null,
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 64
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 128
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 16
                                        }
                                    ]
                                },
                                {
                                    id: 1,
                                    pointerRole: 'none',
                                    keyActions: [
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 42
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 46
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 45
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 39
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 38
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 37
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 36
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 49
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 19
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 18
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 12
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 24
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 28
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mouse',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 51
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 15
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 14
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 13
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 11
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 2
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 56
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 55
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 54
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 16
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 17
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 1
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 8
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 4
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 40
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        null
                                    ]
                                }
                            ]
                        },
                        {
                            modules: [
                                {
                                    id: 0,
                                    pointerRole: 'move',
                                    keyActions: [
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 74
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 82
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 77
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 76
                                        },
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'WOR'
                                        },
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'KAP'
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 75
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 80
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 81
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 79
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 73
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'system',
                                            scancode: 131
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 78
                                        },
                                        null,
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'system',
                                            scancode: 130
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 32
                                        },
                                        null,
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 64
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 128
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 16
                                        }
                                    ]
                                },
                                {
                                    id: 1,
                                    pointerRole: 'scroll',
                                    keyActions: [
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'QWR'
                                        },
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'DVO'
                                        },
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'COL'
                                        },
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'WOR'
                                        },
                                        null,
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'KAP'
                                        },
                                        {
                                            keyActionType: 'switchKeymap',
                                            keymapAbbreviation: 'EGG'
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 75
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 74
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 82
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 77
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 76
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mouse',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 78
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 80
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 81
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 79
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 73
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 2
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 52
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 47
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            scancode: 48
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 1
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 8
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 4
                                        },
                                        null,
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        null
                                    ]
                                }
                            ]
                        },
                        {
                            modules: [
                                {
                                    id: 0,
                                    pointerRole: 'move',
                                    keyActions: [
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'leftClick'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveUp'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'rightClick'
                                        },
                                        null,
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollUp'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveLeft'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveDown'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveRight'
                                        },
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollDown'
                                        },
                                        null,
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollLeft'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'middleClick'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollRight'
                                        },
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 64
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 128
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 16
                                        }
                                    ]
                                },
                                {
                                    id: 1,
                                    pointerRole: 'move',
                                    keyActions: [
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollUp'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'leftClick'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveUp'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'rightClick'
                                        },
                                        null,
                                        null,
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mouse',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollDown'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveLeft'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveDown'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'moveRight'
                                        },
                                        null,
                                        null,
                                        null,
                                        null,
                                        null,
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollLeft'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'middleClick'
                                        },
                                        {
                                            keyActionType: 'mouse',
                                            mouseAction: 'scrollRight'
                                        },
                                        null,
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 1
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 8
                                        },
                                        {
                                            keyActionType: 'keystroke',
                                            type: 'basic',
                                            modifierMask: 4
                                        },
                                        null,
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'fn',
                                            toggle: false
                                        },
                                        {
                                            keyActionType: 'switchLayer',
                                            layer: 'mod',
                                            toggle: false
                                        },
                                        null
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    });
});

function jsonTester(json: any): void {
    const orig = JSON.parse(JSON.stringify(json));
    const config = new UserConfiguration();
    config.fromJsonObject(json);
    expect(json).toEqual(orig); // check the input json is not mutated
    const newJson = config.toJsonObject();
    expect(json).toEqual(orig); // check the input json is not mutated
    expect(newJson).toEqual(json);
}
