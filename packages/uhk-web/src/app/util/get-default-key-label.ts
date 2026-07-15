import { KeystrokeAction, LayerName, UserConfiguration } from 'uhk-common';

import { MapperService } from '../services/mapper.service';

export const DEFAULT_QWERTY_KEYMAP_ABBREVIATION = 'QWR';

export interface GetDefaultQwertyKeyLabelOptions {
    defaultUserConfiguration: UserConfiguration;
    moduleId: number;
    keyId: number;
    mapper: MapperService;
}

export function getDefaultQwertyKeyLabel(options: GetDefaultQwertyKeyLabelOptions): string {
    const qwertyKeymap = options.defaultUserConfiguration.keymaps
        .find(keymap => keymap.abbreviation === DEFAULT_QWERTY_KEYMAP_ABBREVIATION);

    if (!qwertyKeymap) {
        return fallbackKeyLabel(options.keyId);
    }

    const baseLayer = qwertyKeymap.layers.find(layer => layer.id === LayerName.base);

    if (!baseLayer) {
        return fallbackKeyLabel(options.keyId);
    }

    const module = baseLayer.modules.find(moduleConfig => moduleConfig.id === options.moduleId);

    if (!module) {
        return fallbackKeyLabel(options.keyId);
    }

    const keyAction = module.keyActions[options.keyId];

    if (!(keyAction instanceof KeystrokeAction)) {
        return fallbackKeyLabel(options.keyId);
    }

    return formatKeystrokeLabel(keyAction, options.mapper);
}

function formatKeystrokeLabel(keystrokeAction: KeystrokeAction, mapper: MapperService): string {
    if (!keystrokeAction.hasScancode()) {
        return 'Key';
    }

    const labelParts = mapper.scanCodeToText(keystrokeAction.scancode, keystrokeAction.type);

    if (labelParts.length === 1) {
        return labelParts[0];
    }

    if (labelParts.length > 1 && labelParts[1].startsWith('icon')) {
        return labelParts[0];
    }

    return labelParts.join(' ');
}

function fallbackKeyLabel(keyId: number): string {
    return `Key ${keyId}`;
}
