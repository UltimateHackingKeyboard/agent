import { Keymap, LayerName, PlayMacroAction } from '../config-serializer/index.js';

export interface MacroKeyAssignment {
    keymapAbbreviation: string;
    keymapName: string;
    layerId: LayerName;
    moduleId: number;
    keyId: number;
}

export function findMacroKeyAssignments(keymaps: Keymap[], macroId: number): MacroKeyAssignment[] {
    const assignments: MacroKeyAssignment[] = [];

    for (const keymap of keymaps) {
        for (const layer of keymap.layers) {
            for (const module of layer.modules) {
                for (let keyId = 0; keyId < module.keyActions.length; keyId++) {
                    const keyAction = module.keyActions[keyId];

                    if (!(keyAction instanceof PlayMacroAction) || keyAction.macroId !== macroId) {
                        continue;
                    }

                    assignments.push({
                        keymapAbbreviation: keymap.abbreviation,
                        keymapName: keymap.name,
                        layerId: layer.id,
                        moduleId: module.id,
                        keyId,
                    });
                }
            }
        }
    }

    return assignments;
}
