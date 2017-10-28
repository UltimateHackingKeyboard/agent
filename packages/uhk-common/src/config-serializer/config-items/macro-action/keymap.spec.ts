import { UserConfiguration } from '../user-configuration';

describe('keymap', () => {
    it('should normalize SwitchLayerAction if non base layer action is not SwitchLayerAction', () => {
        const inputJsonConfig = {
            dataModelVersion: 1,
            deviceName: 'My UHK',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                pointerRole: 'move',
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
            dataModelVersion: 1,
            deviceName: 'My UHK',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                pointerRole: 'move',
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
        expect(console.warn).toHaveBeenCalledWith('QWERTY.layers[1]modules[0].keyActions[0] is not switch layer. <KeystrokeAction type="basic" scancode="44"> will be override with <SwitchLayerAction layer="0" toggle="false">');
    });

    it('should normalize SwitchLayerAction if non base layer action is other SwitchLayerAction', () => {
        const inputJsonConfig = {
            dataModelVersion: 1,
            deviceName: 'My UHK',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                pointerRole: 'move',
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
            dataModelVersion: 1,
            deviceName: 'My UHK',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
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
                                pointerRole: 'move',
                                keyActions: [
                                    null
                                ]
                            }]
                        },
                        {
                            modules: [{
                                id: 0,
                                pointerRole: 'move',
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
        expect(console.warn).toHaveBeenCalledWith('QWERTY.layers[1]modules[0].keyActions[0] is different switch layer. <SwitchLayerAction layer="1" toggle="false"> will be override with <SwitchLayerAction layer="0" toggle="false">');
    });
});
