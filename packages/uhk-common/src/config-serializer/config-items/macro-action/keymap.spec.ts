import { UserConfiguration } from '../user-configuration';

describe('keymap', () => {
    it('should normalize SwitchLayerAction if non base layer action is not SwitchLayerAction', () => {
        const inputJsonConfig = {
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
            macros: [],
            keymaps: [
                {
                    isDefault: true,
                    abbreviation: 'QWR',
                    name: 'QWERTY',
                    description: '',
                    layers: [
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        toggle: false
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'keystroke',
                                        type: 'basic',
                                        scancode: 44
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        }
                    ]
                }
            ]
        };
        const expectedJsonConfig = {
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
            macros: [],
            keymaps: [
                {
                    isDefault: true,
                    abbreviation: 'QWR',
                    name: 'QWERTY',
                    description: '',
                    layers: [
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 0
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 0
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        }
                    ]
                }
            ]
        };
        spyOn(console, 'warn');
        const inputUserConfig = new UserConfiguration().fromJsonObject(inputJsonConfig);

        expect(inputUserConfig.toJsonObject()).toEqual(expectedJsonConfig);
        // tslint:disable-next-line: max-line-length
        expect(console.warn).toHaveBeenCalledWith('QWERTY.layers[1]modules[0].keyActions[0] is not switch layer. <KeystrokeAction type="basic" scancode="44"> will be override with <SwitchLayerAction layer="0" switchLayerMode="0">');
    });

    it('should normalize SwitchLayerAction if non base layer action is other SwitchLayerAction', () => {
        const inputJsonConfig = {
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
            macros: [],
            keymaps: [
                {
                    isDefault: true,
                    abbreviation: 'QWR',
                    name: 'QWERTY',
                    description: '',
                    layers: [
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        toggle: false
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'fn',
                                        toggle: false
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        }
                    ]
                }
            ]
        };
        const expectedJsonConfig = {
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
            macros: [],
            keymaps: [
                {
                    isDefault: true,
                    abbreviation: 'QWR',
                    name: 'QWERTY',
                    description: '',
                    layers: [
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 0
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 0
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    null
                                ]
                            }]
                        }
                    ]
                }
            ]
        };
        spyOn(console, 'warn');
        const inputUserConfig = new UserConfiguration().fromJsonObject(inputJsonConfig);

        expect(inputUserConfig.toJsonObject()).toEqual(expectedJsonConfig);
        // tslint:disable-next-line: max-line-length
        expect(console.warn).toHaveBeenCalledWith('QWERTY.layers[1]modules[0].keyActions[0] is different switch layer. <SwitchLayerAction layer="1" switchLayerMode="0"> will be override with <SwitchLayerAction layer="0" switchLayerMode="0">');
    });
});
