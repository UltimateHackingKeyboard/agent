import { UserConfiguration } from 'uhk-common';

import { MapperService } from '../services/mapper.service';
import { LAYER_OPTIONS } from '../store/reducers/layer-options';
import { getDefaultQwertyKeyLabel } from './get-default-key-label';

export const MACRO_KEY_ASSIGNMENT_SEPARATOR = ' ⭢ ';

export interface FormatMacroKeyAssignmentLabelOptions {
    keymapName: string;
    layerId: number;
    moduleId: number;
    keyId: number;
    defaultUserConfiguration: UserConfiguration;
    mapper: MapperService;
}

export function formatMacroKeyAssignmentLabel(options: FormatMacroKeyAssignmentLabelOptions): string {
    const layerOption = LAYER_OPTIONS.get(options.layerId);
    const keyLabel = getDefaultQwertyKeyLabel({
        defaultUserConfiguration: options.defaultUserConfiguration,
        moduleId: options.moduleId,
        keyId: options.keyId,
        mapper: options.mapper,
    });

    return `${options.keymapName}${MACRO_KEY_ASSIGNMENT_SEPARATOR}${layerOption.name}${MACRO_KEY_ASSIGNMENT_SEPARATOR}${keyLabel}`;
}
