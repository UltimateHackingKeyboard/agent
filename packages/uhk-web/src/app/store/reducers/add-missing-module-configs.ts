import {
    Keymap,
    Layer,
    LeftSlotModules,
    Module,
    MODULES_DEFAULT_CONFIGS,
    MODULES_NONE_CONFIGS,
    RightSlotModules,
    UserConfiguration
} from 'uhk-common';

import { findModuleById } from '../../util';
import { getBaseLayerOption } from './layer-options';

export function addMissingModuleConfigs(
    userConfig: UserConfiguration,
    moduleSlot: LeftSlotModules | RightSlotModules,
    fillBaseLayerWithNoneKeyActions = false
): UserConfiguration {
    const newConfig = Object.assign(new UserConfiguration(), userConfig);
    const baseLayerOption = getBaseLayerOption();

    newConfig.keymaps = newConfig.keymaps.map(keymap => {
        keymap = new Keymap(keymap);
        keymap.layers = keymap.layers.map(layer => {
            const moduleConfigs = keymap.abbreviation === 'EMP'
                && fillBaseLayerWithNoneKeyActions
                && layer.id === baseLayerOption.id
                ? MODULES_NONE_CONFIGS
                : MODULES_DEFAULT_CONFIGS;

            const moduleIndex = layer.modules.findIndex(findModuleById(moduleSlot));

            if (moduleIndex === -1) {
                layer = new Layer(layer);

                layer.modules.push(new Module(moduleConfigs[moduleSlot]));
            } else if (!layer.modules[moduleIndex].keyActions || layer.modules[moduleIndex].keyActions.length === 0) {

                layer = new Layer(layer);

                layer.modules[moduleIndex] = new Module(moduleConfigs[moduleSlot]);
            }

            return layer;
        });

        return keymap;
    });

    return newConfig;
}
