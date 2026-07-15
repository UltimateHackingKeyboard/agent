import { Keymap, LayerName, UserConfiguration } from 'uhk-common';

import { MacroKeyAssignmentViewModel } from '../models';
import { MapperService } from '../services/mapper.service';
import { initLayerOptions } from '../store/reducers/layer-options';
import { findMacroKeyAssignments, MacroKeyAssignment } from './find-macro-key-assignments';
import { getDefaultQwertyKeyLabel } from './get-default-key-label';

const MACRO_KEY_ASSIGNMENT_SEPARATOR = ' ⭢ ';
const LAYER_OPTIONS = initLayerOptions();

export interface BuildMacroKeyAssignmentViewModelsOptions {
    keymaps: Keymap[];
    macroId: number;
    defaultUserConfiguration: UserConfiguration;
    mapper: MapperService;
}

export function buildMacroKeyAssignmentViewModels(
    options: BuildMacroKeyAssignmentViewModelsOptions
): MacroKeyAssignmentViewModel[] {
    return findMacroKeyAssignments(options.keymaps, options.macroId)
        .sort(compareAssignments)
        .map(assignment => {
            const layerOption = LAYER_OPTIONS.get(assignment.layerId);
            const layerName = layerOption
                ? layerOption.name
                : LayerName[assignment.layerId];
            const keyLabel = getDefaultQwertyKeyLabel({
                defaultUserConfiguration: options.defaultUserConfiguration,
                moduleId: assignment.moduleId,
                keyId: assignment.keyId,
                mapper: options.mapper,
            });

            return {
                keymapAbbreviation: assignment.keymapAbbreviation,
                layerId: assignment.layerId,
                moduleId: assignment.moduleId,
                keyId: assignment.keyId,
                label: `${assignment.keymapName}${MACRO_KEY_ASSIGNMENT_SEPARATOR}${layerName}${MACRO_KEY_ASSIGNMENT_SEPARATOR}${keyLabel}`,
            };
        });
}

function compareAssignments(first: MacroKeyAssignment, second: MacroKeyAssignment): number {
    const keymapComparison = first.keymapName.localeCompare(second.keymapName);

    if (keymapComparison !== 0) {
        return keymapComparison;
    }

    const firstLayerOption = LAYER_OPTIONS.get(first.layerId);
    const secondLayerOption = LAYER_OPTIONS.get(second.layerId);
    const firstLayerOrder = firstLayerOption ? firstLayerOption.order : 0;
    const secondLayerOrder = secondLayerOption ? secondLayerOption.order : 0;

    if (firstLayerOrder !== secondLayerOrder) {
        return firstLayerOrder - secondLayerOrder;
    }

    if (first.moduleId !== second.moduleId) {
        return first.moduleId - second.moduleId;
    }

    return first.keyId - second.keyId;
}
