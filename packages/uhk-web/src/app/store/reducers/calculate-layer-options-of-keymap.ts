import { Keymap } from 'uhk-common';

import { LayerOption } from '../../models';
import { initLayerOptions } from './layer-options';

export function calculateLayerOptionsOfKeymap(keymap: Keymap): Map<number, LayerOption> {
    const layerOptions = initLayerOptions();

    for (const layer of keymap.layers) {
        layerOptions.get(layer.id).selected = true;
    }

    return layerOptions;
}
