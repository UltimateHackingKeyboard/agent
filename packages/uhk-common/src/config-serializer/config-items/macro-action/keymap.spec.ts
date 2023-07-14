import { BacklightingMode } from '../backlighting-mode.js';
import { UserConfiguration } from '../user-configuration.js';

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
                                    {
                                        "keyActionType": "none"
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        "keyActionType": "none"
                                    }
                                ]
                            }]
                        }
                    ]
                }
            ]
        };
        const expectedJsonConfig = {
            userConfigMajorVersion: 6,
            userConfigMinorVersion: 0,
            userConfigPatchVersion: 0,
            deviceName: 'My UHK',
            doubleTapSwitchLayerTimeout: 250,
            iconsAndLayerTextsBrightness: 255,
            alphanumericSegmentsBrightness: 255,
            keyBacklightBrightness: 255,
            ledsFadeTimeout: 0,
            perKeyRgbPresent: false,
            backlightingMode: BacklightingMode.FunctionalBacklighting,
            backlightingNoneActionColor: {r:0, g:0, b:0},
            backlightingScancodeColor: {r:255, g:255, b:255},
            backlightingModifierColor: {r:0, g:255, b:255},
            backlightingShortcutColor: {r:0, g:0, b:255},
            backlightingSwitchLayerColor: {r:255, g:255, b:0},
            backlightingSwitchKeymapColor: {r:255, g:0, b:0},
            backlightingMouseColor: {r:0, g:255, b:0},
            backlightingMacroColor: {r:255, g:0, b:255},
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
                            id: 'base',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 'holdAndDoubleTapToggle'
                                    }
                                ]
                            }]
                        },
                        {
                            id: 'mod',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 'holdAndDoubleTapToggle'
                                    }
                                ]
                            }]
                        },
                        {
                            id: 'fn',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        "keyActionType": "none"
                                    }
                                ]
                            }]
                        },
                        {
                            id: 'mouse',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        "keyActionType": "none"
                                    }
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
        expect(console.warn).toHaveBeenCalledWith('QWERTY.layers[1]modules[0].keyActions[0] is not switch layer. <KeystrokeAction type="basic" scancode="44"> will be override with <SwitchLayerAction layer="0" switchLayerMode="holdAndDoubleTapToggle">');
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
                                    {
                                        "keyActionType": "none"
                                    }
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        "keyActionType": "none"
                                    }
                                ]
                            }]
                        }
                    ]
                }
            ]
        };
        const expectedJsonConfig = {
            userConfigMajorVersion: 6,
            userConfigMinorVersion: 0,
            userConfigPatchVersion: 0,
            deviceName: 'My UHK',
            doubleTapSwitchLayerTimeout: 250,
            iconsAndLayerTextsBrightness: 255,
            alphanumericSegmentsBrightness: 255,
            keyBacklightBrightness: 255,
            ledsFadeTimeout: 0,
            perKeyRgbPresent: false,
            backlightingMode: BacklightingMode.FunctionalBacklighting,
            backlightingNoneActionColor: {r:0, g:0, b:0},
            backlightingScancodeColor: {r:255, g:255, b:255},
            backlightingModifierColor: {r:0, g:255, b:255},
            backlightingShortcutColor: {r:0, g:0, b:255},
            backlightingSwitchLayerColor: {r:255, g:255, b:0},
            backlightingSwitchKeymapColor: {r:255, g:0, b:0},
            backlightingMouseColor: {r:0, g:255, b:0},
            backlightingMacroColor: {r:255, g:0, b:255},
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
                            id: 'base',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 'holdAndDoubleTapToggle'
                                    }
                                ]
                            }]
                        },
                        {
                            id: 'mod',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        keyActionType: 'switchLayer',
                                        layer: 'mod',
                                        switchLayerMode: 'holdAndDoubleTapToggle'
                                    }
                                ]
                            }]
                        },
                        {
                            id: 'fn',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        "keyActionType": "none"
                                    }
                                ]
                            }]
                        },
                        {
                            id: 'mouse',
                            modules: [{
                                id: 0,
                                keyActions: [
                                    {
                                        "keyActionType": "none"
                                    }
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
        expect(console.warn).toHaveBeenCalledWith('QWERTY.layers[1]modules[0].keyActions[0] is different switch layer. <SwitchLayerAction layer="1" switchLayerMode="holdAndDoubleTapToggle"> will be override with <SwitchLayerAction layer="0" switchLayerMode="holdAndDoubleTapToggle">');
    });
});
