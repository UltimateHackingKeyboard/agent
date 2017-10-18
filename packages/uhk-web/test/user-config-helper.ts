import { cloneDeep } from 'lodash';

const defaultUserConfig = {
    dataModelVersion: 4,
    moduleConfigurations: [
        {
            id: 1,
            initialPointerSpeed: 1,
            pointerAcceleration: 5,
            maxPointerSpeed: 200
        }
    ],
    keymaps: [
        {
            isDefault: true,
            abbreviation: 'QWR',
            name: 'QWERTY',
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
                                    'keyActionType': 'switchLayer',
                                    'layer': 'mod',
                                    'toggle': false
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
                                    scancode: 64
                                },
                                {
                                    keyActionType: 'keystroke',
                                    type: 'basic',
                                    scancode: 65
                                },
                                {
                                    keyActionType: 'switchLayer',
                                    layer: 'mod',
                                    toggle: false
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
                                    scancode: 41
                                },
                                {
                                    keyActionType: 'keystroke',
                                    type: 'basic',
                                    scancode: 58
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
                                null
                            ]
                        },
                        {
                            id: 1,
                            pointerRole: 'scroll',
                            keyActions: [
                                null,
                                {
                                    keyActionType: 'switchKeymap',
                                    keymapAbbreviation: 'DVO'
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
                                null
                            ]
                        },
                        {
                            id: 1,
                            pointerRole: 'move',
                            keyActions: [
                                null,
                                null,
                                null
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    macros: []
};

export function getDefaultUserConfig() {
    return cloneDeep(defaultUserConfig);
}
