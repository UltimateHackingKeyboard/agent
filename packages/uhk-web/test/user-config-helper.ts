import cloneDeep from 'lodash-es/cloneDeep';

const defaultUserConfig = {
    userConfigMajorVersion: 3,
    userConfigMinorVersion: 0,
    userConfigPatchVersion: 0,
    deviceName: 'My UHK',
    doubleTapSwitchLayerTimeout: 250,
    iconsAndLayerTextsBrightness: 255,
    alphanumericSegmentsBrightness: 255,
    keyBacklightBrightness: 255,
    mouseMoveInitialSpeed: 5,
    mouseMoveAcceleration: 35,
    mouseMoveDeceleratedSpeed: 10,
    mouseMoveBaseSpeed: 40,
    mouseMoveAcceleratedSpeed: 80,
    mouseScrollInitialSpeed: 20,
    mouseScrollAcceleration: 20,
    mouseScrollDeceleratedSpeed: 20,
    mouseScrollBaseSpeed: 20,
    mouseScrollAcceleratedSpeed: 50,
    moduleConfigurations: [],
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
                                    keyActionType: 'switchLayer',
                                    layer: 'mod',
                                    toggle: false
                                }
                            ]
                        },
                        {
                            id: 1,
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
                            keyActions: []
                        }
                    ]
                },
                {
                    modules: [
                        {
                            id: 0,
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
                            keyActions: [null, null, null]
                        },
                        {
                            id: 1,
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
                            keyActions: [null, null, null]
                        },
                        {
                            id: 1,
                            keyActions: [null, null, null]
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
