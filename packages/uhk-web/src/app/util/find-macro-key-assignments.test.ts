import { describe, it } from 'node:test';

import { Keymap, Layer, LayerName, Module, PlayMacroAction } from 'uhk-common';

import { findMacroKeyAssignments } from './find-macro-key-assignments.js';

interface CreateKeymapWithMacroAssignmentOptions {
    abbreviation: string;
    name: string;
    layerId: LayerName;
    moduleId: number;
    keyId: number;
    macroId: number;
}

function createKeymapWithMacroAssignment(options: CreateKeymapWithMacroAssignmentOptions): Keymap {
    const keyActions = [];
    keyActions[options.keyId] = Object.assign(new PlayMacroAction(), { macroId: options.macroId });

    const keymap = new Keymap();
    keymap.abbreviation = options.abbreviation;
    keymap.name = options.name;
    keymap.layers = [
        Object.assign(new Layer(), {
            id: options.layerId,
            modules: [
                Object.assign(new Module(), {
                    id: options.moduleId,
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
            createKeymapWithMacroAssignment({
                abbreviation: 'QWR',
                name: 'QWERTY for PC',
                layerId: LayerName.fn,
                moduleId: 0,
                keyId: 2,
                macroId: 5,
            }),
            createKeymapWithMacroAssignment({
                abbreviation: 'DVO',
                name: 'Dvorak',
                layerId: LayerName.base,
                moduleId: 1,
                keyId: 0,
                macroId: 5,
            }),
            createKeymapWithMacroAssignment({
                abbreviation: 'QWR',
                name: 'QWERTY for PC',
                layerId: LayerName.mod,
                moduleId: 0,
                keyId: 1,
                macroId: 9,
            }),
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
            createKeymapWithMacroAssignment({
                abbreviation: 'QWR',
                name: 'QWERTY for PC',
                layerId: LayerName.fn,
                moduleId: 0,
                keyId: 2,
                macroId: 5,
            }),
        ];

        assert.deepEqual(findMacroKeyAssignments(keymaps, 99), []);
    });
});
