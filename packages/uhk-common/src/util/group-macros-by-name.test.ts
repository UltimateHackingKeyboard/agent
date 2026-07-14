import { describe, it } from 'node:test';

import {
    DEFAULT_MACRO_GROUPING_SETTINGS,
    MACRO_GROUPING_MAX_DEPTH,
    normalizeMacroGroupingSettings,
} from '../models/macro-grouping-settings.js';
import {
    findMacroGroupAncestorPaths,
    groupMacrosByName,
    GroupableMacroItem,
    splitMacroName
} from './group-macros-by-name.js';

function createMacro(id: number, name: string): GroupableMacroItem {
    return {
        id,
        name
    };
}

const ENABLED_MACRO_GROUPING_SETTINGS = {
    ...DEFAULT_MACRO_GROUPING_SETTINGS,
    enabled: true,
};

describe('splitMacroName', () => {
    it('splits on non-alphanumeric separators', ({ assert }) => {
        assert.deepEqual(splitMacroName('Doom: Chainsaw', false), ['Doom', 'Chainsaw']);
        assert.deepEqual(splitMacroName('Doom_Plasma gun', false), ['Doom', 'Plasma', 'gun']);
    });

    it('optionally splits camel case segments', ({ assert }) => {
        assert.deepEqual(splitMacroName('bindMouseMacros', true), ['bind', 'Mouse', 'Macros']);
    });

    it('does not split on dollar signs used in smart macro names', ({ assert }) => {
        assert.deepEqual(splitMacroName('$onInit', true), ['$on', 'Init']);
        assert.deepEqual(splitMacroName('$onInit', false), ['$onInit']);
    });

    it('preserves non-English letters when splitting on separators', ({ assert }) => {
        assert.deepEqual(splitMacroName('Az én macróm', false), ['Az', 'én', 'macróm']);
        assert.deepEqual(splitMacroName('Az-én-macróm', false), ['Az', 'én', 'macróm']);
    });

    it('keeps unicode numbers in a single segment', ({ assert }) => {
        assert.deepEqual(splitMacroName('2²', false), ['2²']);
    });
});

describe('groupMacrosByName', () => {
    it('returns a flat list when grouping is disabled', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom: Chainsaw'),
            createMacro(2, 'Doom: Plasma gun')
        ];

        const result = groupMacrosByName(macros, {
            ...DEFAULT_MACRO_GROUPING_SETTINGS,
            enabled: false
        });

        assert.equal(result.length, 2);
        assert.equal(result[0].type, 'macro');
        assert.equal(result[1].type, 'macro');
    });

    it('groups macros that share a prefix separated by non-alphanumeric characters', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom: Chainsaw'),
            createMacro(2, 'Doom: Plasma gun'),
            createMacro(3, 'Brightness up')
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.equal(result.length, 2);
        assert.deepEqual(result.map(node => node.type), ['macro', 'group']);
        assert.equal(result[0].macro?.name, 'Brightness up');
        assert.equal(result[1].label, 'Doom');
        assert.equal(result[1].children?.length, 2);
        assert.equal(result[1].children?.[0].macro?.name, 'Doom: Chainsaw');
        assert.equal(result[1].children?.[1].macro?.name, 'Doom: Plasma gun');
    });

    it('does not create a group when there are fewer macros than minChildren', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom: Chainsaw'),
            createMacro(2, 'Brightness up')
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.equal(result.length, 2);
        assert.deepEqual(result.map(node => node.type), ['macro', 'macro']);
        assert.equal(result[0].macro?.name, 'Brightness up');
        assert.equal(result[1].macro?.name, 'Doom: Chainsaw');
    });

    it('groups by camel case when enabled', ({ assert }) => {
        const macros = [
            createMacro(1, 'bindMouseLeft'),
            createMacro(2, 'bindMouseRight'),
            createMacro(3, 'brightnessUp')
        ];

        const result = groupMacrosByName(macros, {
            ...ENABLED_MACRO_GROUPING_SETTINGS,
            camelCaseSeparation: true
        });

        assert.equal(result.length, 2);
        assert.deepEqual(result.map(node => node.type), ['group', 'macro']);
        assert.equal(result[0].label, 'bind');
        assert.equal(result[0].children?.length, 2);
        assert.deepEqual(result[0].children?.map(child => child.macro?.name), ['bindMouseLeft', 'bindMouseRight']);
        assert.equal(result[1].macro?.name, 'brightnessUp');
    });

    it('groups dollar-prefixed smart macro names under the dollar prefix', ({ assert }) => {
        const macros = [
            createMacro(1, '$onInit'),
            createMacro(2, '$onJoin'),
        ];

        const result = groupMacrosByName(macros, {
            ...ENABLED_MACRO_GROUPING_SETTINGS,
            camelCaseSeparation: true,
        });

        assert.equal(result.length, 1);
        assert.equal(result[0].type, 'group');
        assert.equal(result[0].label, '$on');
        assert.deepEqual(result[0].children?.map(child => child.macro?.name), ['$onInit', '$onJoin']);
    });

    it('groups non-English macro names that share a prefix', ({ assert }) => {
        const macros = [
            createMacro(1, 'Az én: első'),
            createMacro(2, 'Az én: második'),
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.equal(result.length, 1);
        assert.equal(result[0].type, 'group');
        assert.equal(result[0].label, 'Az');
        assert.deepEqual(result[0].children?.map(child => child.macro?.name), ['Az én: első', 'Az én: második']);
    });

    it('keeps parent-level remainders when deeper nesting does not apply', ({ assert }) => {
        const macros = [
            createMacro(1, 'Open daily sites'),
            createMacro(2, 'Open weekly sites'),
        ];

        const result = groupMacrosByName(macros, {
            ...ENABLED_MACRO_GROUPING_SETTINGS,
            maxDepth: 2,
        });

        assert.equal(result.length, 1);
        assert.equal(result[0].label, 'Open');
        assert.deepEqual(result[0].children?.map(child => child.macro?.name), ['Open daily sites', 'Open weekly sites']);
    });

    it('places a macro named like a group inside that group', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom'),
            createMacro(2, 'Doom: Chainsaw'),
            createMacro(3, 'Doom: Plasma gun'),
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.equal(result.length, 1);
        assert.equal(result[0].type, 'group');
        assert.equal(result[0].label, 'Doom');
        assert.deepEqual(result[0].children?.map(child => child.macro?.name), [
            'Doom',
            'Doom: Chainsaw',
            'Doom: Plasma gun',
        ]);
    });

    it('places an exact subgroup name inside a nested group', ({ assert }) => {
        const macros = [
            createMacro(1, 'Open: daily'),
            createMacro(2, 'Open: daily: morning'),
            createMacro(3, 'Open: daily: evening'),
        ];

        const result = groupMacrosByName(macros, {
            ...ENABLED_MACRO_GROUPING_SETTINGS,
            maxDepth: 2,
        });

        assert.equal(result.length, 1);
        assert.equal(result[0].label, 'Open');
        assert.equal(result[0].children?.length, 1);
        assert.equal(result[0].children?.[0].type, 'group');
        assert.equal(result[0].children?.[0].label, 'daily');
        assert.deepEqual(result[0].children?.[0].children?.map(child => child.macro?.name), [
            'Open: daily',
            'Open: daily: evening',
            'Open: daily: morning',
        ]);
    });

    it('keeps a same-named macro outside when the group is not created', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom'),
            createMacro(2, 'Doom: Chainsaw'),
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.equal(result.length, 2);
        assert.deepEqual(result.map(node => node.macro?.name), ['Doom', 'Doom: Chainsaw']);
    });
});

describe('findMacroGroupAncestorPaths', () => {
    it('returns ancestor group paths for a nested macro', ({ assert }) => {
        const macros = [
            createMacro(1, 'Open: daily sites'),
            createMacro(2, 'Open: weekly sites'),
        ];
        const tree = groupMacrosByName(macros, {
            ...ENABLED_MACRO_GROUPING_SETTINGS,
            maxDepth: 2,
        });

        assert.deepEqual(findMacroGroupAncestorPaths(tree, 1), ['Open']);
        assert.deepEqual(findMacroGroupAncestorPaths(tree, 2), ['Open']);
    });

    it('returns an empty array for macros that are not grouped', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom'),
            createMacro(2, 'Chainsaw'),
        ];
        const tree = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.deepEqual(findMacroGroupAncestorPaths(tree, 1), []);
    });

    it('returns null when the macro is not in the tree', ({ assert }) => {
        const tree = groupMacrosByName([createMacro(1, 'Doom: Chainsaw')], ENABLED_MACRO_GROUPING_SETTINGS);

        assert.equal(findMacroGroupAncestorPaths(tree, 99), null);
    });
});

describe('normalizeMacroGroupingSettings', () => {
    it('clamps maxDepth to the supported sidebar layout limit', ({ assert }) => {
        const result = normalizeMacroGroupingSettings({ maxDepth: 99 });

        assert.equal(result.maxDepth, MACRO_GROUPING_MAX_DEPTH);
    });
});
