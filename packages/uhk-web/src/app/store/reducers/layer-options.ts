import { SecondaryRoleAction } from 'uhk-common';
import { LayerName } from 'uhk-common';

import { LayerOption } from '../../models';

export function getBaseLayerOption(): LayerOption {
    return { id: LayerName.base, name: 'Base', selected: false, order: 0, allowed: false };
}

export function initLayerOptions(): Map<number, LayerOption> {
    const layerOptions: Map<number, LayerOption> = new Map<number, LayerOption>();
    layerOptions.set(LayerName.base, getBaseLayerOption());
    layerOptions.set(LayerName.mod, { id: LayerName.mod, name: 'Mod', selected: false, order: 1, allowed: true, secondaryRole: SecondaryRoleAction.mod });
    layerOptions.set(LayerName.fn, { id: LayerName.fn, name: 'Fn', selected: false, order: 3, allowed: true, secondaryRole: SecondaryRoleAction.fn });
    layerOptions.set(LayerName.mouse, { id: LayerName.mouse, name: 'Mouse', selected: false, order: 2, allowed: true, secondaryRole: SecondaryRoleAction.mouse });
    layerOptions.set(LayerName.fn2, { id: LayerName.fn2, name: 'Fn2', selected: false, order: 4, allowed: true, secondaryRole: SecondaryRoleAction.fn2 });
    layerOptions.set(LayerName.fn3, { id: LayerName.fn3, name: 'Fn3', selected: false, order: 5, allowed: true, secondaryRole: SecondaryRoleAction.fn3 });
    layerOptions.set(LayerName.fn4, { id: LayerName.fn4, name: 'Fn4', selected: false, order: 6, allowed: true, secondaryRole: SecondaryRoleAction.fn4 });
    layerOptions.set(LayerName.fn5, { id: LayerName.fn5, name: 'Fn5', selected: false, order: 7, allowed: true, secondaryRole: SecondaryRoleAction.fn5 });
    layerOptions.set(LayerName.shift, { id: LayerName.shift, name: 'Shift', selected: false, order: 8, allowed: false });
    layerOptions.set(LayerName.control, { id: LayerName.control, name: 'Ctrl', selected: false, order: 9, allowed: false });
    layerOptions.set(LayerName.alt, { id: LayerName.alt, name: 'Alt', selected: false, order: 10, allowed: false });
    layerOptions.set(LayerName.super, { id: LayerName.super, name: 'Super', selected: false, order: 11, allowed: false });

    return layerOptions;
}
