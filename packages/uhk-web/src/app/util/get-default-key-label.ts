import { KeystrokeAction, LayerName, UserConfiguration } from 'uhk-common';

import { MapperService } from '../services/mapper.service';

export const DEFAULT_QWERTY_KEYMAP_ABBREVIATION = 'QWR';

export function getDefaultQwertyKeyLabel(
    defaultUserConfiguration: UserConfiguration,
    moduleId: number,
    keyId: number,
    mapper: MapperService
): string {
    const qwertyKeymap = defaultUserConfiguration.keymaps
        .find(keymap => keymap.abbreviation === DEFAULT_QWERTY_KEYMAP_ABBREVIATION);

    if (!qwertyKeymap) {
        return fallbackKeyLabel(keyId);
    }

    const baseLayer = qwertyKeymap.layers.find(layer => layer.id === LayerName.base);

    if (!baseLayer) {
        return fallbackKeyLabel(keyId);
    }

    const module = baseLayer.modules.find(moduleConfig => moduleConfig.id === moduleId);

    if (!module) {
        return fallbackKeyLabel(keyId);
    }

    const keyAction = module.keyActions[keyId];

    if (!(keyAction instanceof KeystrokeAction)) {
        return fallbackKeyLabel(keyId);
    }

    return formatKeystrokeLabel(keyAction, mapper);
}

function formatKeystrokeLabel(keystrokeAction: KeystrokeAction, mapper: MapperService): string {
    if (!keystrokeAction.hasScancode()) {
        return fallbackKeyLabel();
    }

    const labelParts = mapper.scanCodeToText(keystrokeAction.scancode, keystrokeAction.type);

    if (labelParts.length === 1) {
        return labelParts[0];
    }

    if (labelParts[1]?.startsWith('icon')) {
        return labelParts[0];
    }

    return labelParts.join(' ');
}

function fallbackKeyLabel(keyId?: number): string {
    return keyId === undefined ? 'Key' : `Key ${keyId}`;
}
