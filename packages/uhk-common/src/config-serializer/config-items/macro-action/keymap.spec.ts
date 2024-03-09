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
            userConfigMajorVersion: 7,
            userConfigMinorVersion: 0,
            userConfigPatchVersion: 0,
            deviceName: 'My UHK',
            doubleTapSwitchLayerTimeout: 250,
            iconsAndLayerTextsBrightness: 255,
            alphanumericSegmentsBrightness: 255,
            keyBacklightBrightness: 255,
            ledsFadeTimeout: 0,
            perKeyRgbPresent: false,
            backlightingMode: 'FunctionalBacklighting',
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
            secondaryRoleStrategy: 'Simple',
            secondaryRoleAdvancedStrategyDoubletapTimeout: 200,
            secondaryRoleAdvancedStrategyTimeout: 350,
            secondaryRoleAdvancedStrategySafetyMargin: 50,
            secondaryRoleAdvancedStrategyTriggerByRelease: true,
            secondaryRoleAdvancedStrategyDoubletapToPrimary: true,
            secondaryRoleAdvancedStrategyTimeoutAction: 'Secondary',
            mouseScrollAxisSkew: 1,
            mouseMoveAxisSkew: 1,
            diagonalSpeedCompensation: false,
            doubletapTimeout: 400,
            keystrokeDelay: 0,
            moduleConfigurations: [
                {
                    id: 'KeyClusterLeft',
                    navigationModeBaseLayer: 'Scroll',
                    navigationModeModLayer: 'Cursor',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0,
                    baseSpeed: 5,
                    xceleration: 0,
                    scrollSpeedDivisor: 5,
                    caretSpeedDivisor: 5,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 0.5,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false,
                    keyClusterSwapAxes: false,
                    keyClusterInvertHorizontalScrolling: false
                },
                {
                    id: 'TouchpadRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Scroll',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0.7,
                    baseSpeed: 0.5,
                    xceleration: 1,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false,
                    touchpadPinchZoomDivisor: 4,
                    touchpadHoldContinuationTimeout: 0,
                    touchpadPinchToZoom: 'Zoom'
                },
                {
                    id: 'TrackballRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Scroll',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0.5,
                    baseSpeed: 0.5,
                    xceleration: 1,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false
                },
                {
                    id: 'TrackpointRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Scroll',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 1,
                    baseSpeed: 0,
                    xceleration: 0,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false
                }
            ],
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
            userConfigMajorVersion: 7,
            userConfigMinorVersion: 0,
            userConfigPatchVersion: 0,
            deviceName: 'My UHK',
            doubleTapSwitchLayerTimeout: 250,
            iconsAndLayerTextsBrightness: 255,
            alphanumericSegmentsBrightness: 255,
            keyBacklightBrightness: 255,
            ledsFadeTimeout: 0,
            perKeyRgbPresent: false,
            backlightingMode: 'FunctionalBacklighting',
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
            secondaryRoleStrategy: 'Simple',
            secondaryRoleAdvancedStrategyDoubletapTimeout: 200,
            secondaryRoleAdvancedStrategyTimeout: 350,
            secondaryRoleAdvancedStrategySafetyMargin: 50,
            secondaryRoleAdvancedStrategyTriggerByRelease: true,
            secondaryRoleAdvancedStrategyDoubletapToPrimary: true,
            secondaryRoleAdvancedStrategyTimeoutAction: 'Secondary',
            mouseScrollAxisSkew: 1,
            mouseMoveAxisSkew: 1,
            diagonalSpeedCompensation: false,
            doubletapTimeout: 400,
            keystrokeDelay: 0,
            moduleConfigurations: [
                {
                    id: 'KeyClusterLeft',
                    navigationModeBaseLayer: 'Scroll',
                    navigationModeModLayer: 'Cursor',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0,
                    baseSpeed: 5,
                    xceleration: 0,
                    scrollSpeedDivisor: 5,
                    caretSpeedDivisor: 5,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 0.5,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false,
                    keyClusterSwapAxes: false,
                    keyClusterInvertHorizontalScrolling: false
                },
                {
                    id: 'TouchpadRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Scroll',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0.7,
                    baseSpeed: 0.5,
                    xceleration: 1,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false,
                    touchpadPinchZoomDivisor: 4,
                    touchpadHoldContinuationTimeout: 0,
                    touchpadPinchToZoom: 'Zoom'
                },
                {
                    id: 'TrackballRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Scroll',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 0.5,
                    baseSpeed: 0.5,
                    xceleration: 1,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false
                },
                {
                    id: 'TrackpointRight',
                    navigationModeBaseLayer: 'Cursor',
                    navigationModeModLayer: 'Scroll',
                    navigationModeFnLayer: 'Caret',
                    navigationModeMouseLayer: 'Cursor',
                    navigationModeFn2Layer: 'Cursor',
                    navigationModeFn3Layer: 'Cursor',
                    navigationModeFn4Layer: 'Cursor',
                    navigationModeFn5Layer: 'Cursor',
                    speed: 1,
                    baseSpeed: 0,
                    xceleration: 0,
                    scrollSpeedDivisor: 8,
                    caretSpeedDivisor: 16,
                    scrollAxisLock: true,
                    caretAxisLock: true,
                    axisLockFirstTickSkew: 2,
                    axisLockSkew: 0.5,
                    invertScrollDirectionY: false
                }
            ],
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
