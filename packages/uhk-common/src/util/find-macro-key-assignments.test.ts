import { describe, it } from 'node:test';

import { Keymap, Layer, LayerName, Module, PlayMacroAction } from '../config-serializer/index.js';
import { findMacroKeyAssignments } from './find-macro-key-assignments.js';

function createKeymapWithMacroAssignment(
    abbreviation: string,
    name: string,
    layerId: LayerName,
    moduleId: number,
    keyId: number,
    macroId: number
): Keymap {
    const keyActions = [];
    keyActions[keyId] = Object.assign(new PlayMacroAction(), { macroId });

    const keymap = new Keymap();
    keymap.abbreviation = abbreviation;
    keymap.name = name;
    keymap.layers = [
        Object.assign(new Layer(), {
            id: layerId,
            modules: [
                Object.assign(new Module(), {
                    id: moduleId,
                    keyActions,
                }),
            ],
        }),
    ];

    return keymap;
}

describe('findMacroKeyAssignments', () => {
    it('returns assignments for the requested macro', ({ assert }) => {
        const keymaps = [
            createKeymapWithMacroAssignment('QWR', 'QWERTY for PC', LayerName.fn, 0, 2, 5),
            createKeymapWithMacroAssignment('DVO', 'Dvorak', LayerName.base, 1, 0, 5),
            createKeymapWithMacroAssignment('QWR', 'QWERTY for PC', LayerName.mod, 0, 1, 9),
        ];

        const assignments = findMacroKeyAssignments(keymaps, 5);

        assert.equal(assignments.length, 2);
        assert.deepEqual(assignments[0], {
            keymapAbbreviation: 'QWR',
            keymapName: 'QWERTY for PC',
            layerId: LayerName.fn,
            moduleId: 0,
            keyId: 2,
        });
        assert.deepEqual(assignments[1], {
            keymapAbbreviation: 'DVO',
            keymapName: 'Dvorak',
            layerId: LayerName.base,
            moduleId: 1,
            keyId: 0,
        });
    });

    it('returns an empty list when the macro is not assigned', ({ assert }) => {
        const keymaps = [
            createKeymapWithMacroAssignment('QWR', 'QWERTY for PC', LayerName.fn, 0, 2, 5),
        ];

        assert.deepEqual(findMacroKeyAssignments(keymaps, 99), []);
    });
});
