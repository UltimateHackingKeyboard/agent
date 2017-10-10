import { reducer, initialState } from './user-configuration';
import { cloneDeep } from 'lodash';
import { KeystrokeAction, KeystrokeType, SwitchLayerAction, UserConfiguration, LayerName } from 'uhk-common';

import { getDefaultUserConfig } from '../../../../test/user-config-helper';
import { KeymapActions } from '../actions';

describe('user-configuration reducer', () => {
    it('should be initiate with default state', () => {
        const result = reducer(undefined, {} as any);
        expect(result).toEqual(initialState);
    });

    describe('SAVE_KEY', () => {
        it('should process KeyStrokeAction', () => {
            const defaultUserConfig = new UserConfiguration().fromJsonObject(getDefaultUserConfig());
            const state = new UserConfiguration().fromJsonObject(getDefaultUserConfig());
            const keystrokeAction = new KeystrokeAction({_scancode: 100, type: KeystrokeType.basic} as any);
            const saveKeyAction: KeymapActions.SaveKeyAction = {
                type: KeymapActions.SAVE_KEY,
                payload: {
                    keymap: cloneDeep(defaultUserConfig.keymaps[0]),
                    layer: 0,
                    module: 0,
                    key: 0,
                    keyAction: keystrokeAction
                }
            };
            const result = reducer(state, saveKeyAction);
            const expectedKeyAction = <KeystrokeAction>result.keymaps[0].layers[0].modules[0].keyActions[0];
            expect(expectedKeyAction).toEqual(keystrokeAction);
            expect(result).not.toBe(defaultUserConfig);
            // check key actions not changed on other layers
            for (let i = 1; i < result.keymaps[0].layers.length; i++) {
                const keyAction = result.keymaps[0].layers[i].modules[0].keyActions[0];
                const defaultKeyAction = defaultUserConfig.keymaps[0].layers[i].modules[0].keyActions[0];

                expect(keyAction).toEqual(defaultKeyAction);
            }
        });

        for (const layerName in LayerName) {
            const layerId = Number(layerName);
            if (isNaN(layerId)) {
                it(`should process ${layerName} SwitchLayerAction`, () => {
                    const defaultUserConfig = new UserConfiguration().fromJsonObject(getDefaultUserConfig());
                    const state = new UserConfiguration().fromJsonObject(getDefaultUserConfig());
                    const destinationLayerId = LayerName[layerName];
                    const switchLayerAction = new SwitchLayerAction({isLayerToggleable: false, layer: destinationLayerId} as any);
                    const saveKeyAction: KeymapActions.SaveKeyAction = {
                        type: KeymapActions.SAVE_KEY,
                        payload: {
                            keymap: cloneDeep(defaultUserConfig.keymaps[0]),
                            layer: 0,
                            module: 0,
                            key: 0,
                            keyAction: switchLayerAction
                        }
                    };
                    const result = reducer(state, saveKeyAction);
                    const expectedKeyAction = <SwitchLayerAction>result.keymaps[0].layers[0].modules[0].keyActions[0];
                    expect(expectedKeyAction).toEqual(switchLayerAction);
                    expect(result).not.toBe(defaultUserConfig);
                    // check key actions not changed on other layers
                    for (let i = 1; i < result.keymaps[0].layers.length; i++) {
                        const keyAction = result.keymaps[0].layers[i].modules[0].keyActions[0];
                        const defaultKeyAction = defaultUserConfig.keymaps[0].layers[i].modules[0].keyActions[0];

                        if (i - 1 === switchLayerAction.layer) {
                            expect(keyAction).toEqual(switchLayerAction);
                        }
                        else {
                            expect(keyAction).toEqual(defaultKeyAction);
                        }
                    }
                });
            }
        }
    });
});
