import { describe, it } from 'node:test';

import { DEFAULT_MACRO_GROUPING_SETTINGS } from 'uhk-common';

import {
    findMacroGroupAncestorPaths,
    groupMacrosByName,
    GroupableMacroItem,
    MACRO_GROUPING_MAX_DEPTH,
    normalizeMacroGroupingSettings,
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
        assert.deepStrictEqual(splitMacroName('Doom: Chainsaw', false), ['Doom', 'Chainsaw']);
        assert.deepStrictEqual(splitMacroName('Doom_Plasma gun', false), ['Doom', 'Plasma', 'gun']);
    });

    it('optionally splits camel case segments', ({ assert }) => {
        assert.deepStrictEqual(splitMacroName('bindMouseMacros', true), ['bind', 'Mouse', 'Macros']);
    });

    it('optionally splits unicode camel case segments', ({ assert }) => {
        assert.deepStrictEqual(splitMacroName('macróÉsÉn', true), ['macró', 'És', 'Én']);
    });

    it('does not split on dollar signs used in smart macro names', ({ assert }) => {
        assert.deepStrictEqual(splitMacroName('$onInit', true), ['$on', 'Init']);
        assert.deepStrictEqual(splitMacroName('$onInit', false), ['$onInit']);
    });

    it('preserves non-English letters when splitting on separators', ({ assert }) => {
        assert.deepStrictEqual(splitMacroName('Az én macróm', false), ['Az', 'én', 'macróm']);
        assert.deepStrictEqual(splitMacroName('Az-én-macróm', false), ['Az', 'én', 'macróm']);
    });

    it('keeps unicode numbers in a single segment', ({ assert }) => {
        assert.deepStrictEqual(splitMacroName('2²', false), ['2²']);
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

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].type, 'macro');
        assert.strictEqual(result[1].type, 'macro');
    });

    it('groups macros that share a prefix separated by non-alphanumeric characters', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom: Chainsaw'),
            createMacro(2, 'Doom: Plasma gun'),
            createMacro(3, 'Brightness up')
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.strictEqual(result.length, 2);
        assert.deepStrictEqual(result[0], {
            type: 'macro',
            macro: {
                id: 3,
                name: 'Brightness up'
            }
        });
        assert.deepStrictEqual(result[1], {
            children: [
                {
                    macro: {
                        id: 1,
                        name: 'Doom: Chainsaw'
                    },
                    type: 'macro',
                },
                {
                    macro: {
                        id: 2,
                        name: 'Doom: Plasma gun'
                    },
                    type: 'macro',
                },
            ],
            label: 'Doom',
            path: 'Doom',
            type: 'group',
        });
    });

    it('does not create a group when there are fewer macros than minChildren', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom: Chainsaw'),
            createMacro(2, 'Brightness up')
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.strictEqual(result.length, 2);
        assert.deepStrictEqual(result.map(node => node.type), ['macro', 'macro']);
        assert.deepStrictEqual(result[0], {
            type: 'macro',
            macro: {
                id: 2,
                name: 'Brightness up'
            }
        });

        assert.deepStrictEqual(result[1], {
            type: 'macro',
            macro: {
                id: 1,
                name: 'Doom: Chainsaw'
            }
        });
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

        assert.strictEqual(result.length, 2);

        assert.deepStrictEqual(result[0], {
            children: [
                {
                    macro: {
                        id: 1,
                        name: 'bindMouseLeft'
                    },
                    type: 'macro',
                },
                {
                    macro: {
                        id: 2,
                        name: 'bindMouseRight'
                    },
                    type: 'macro',
                },
            ],
            label: 'bind',
            path: 'bind',
            type: 'group',
        });
        assert.deepStrictEqual(result[1], {
            type: 'macro',
            macro: {
                id: 3,
                name: 'brightnessUp'
            }
        });
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

        assert.deepStrictEqual(result, [
            {
                type: 'group',
                label: '$on',
                path: '$on',
                children: [
                    {
                        macro: {
                            id: 1,
                            name: '$onInit'
                        },
                        type: 'macro',
                    },
                    {
                        macro: {
                            id: 2,
                            name: '$onJoin'
                        },
                        type: 'macro',
                    }
                ]
            }
        ])
    });

    it('groups non-English macro names that share a prefix', ({ assert }) => {
        const macros = [
            createMacro(1, 'Az én: első'),
            createMacro(2, 'Az én: második'),
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.deepStrictEqual(result, [
            {
                type: 'group',
                label: 'Az',
                path: 'Az',
                children: [
                    {
                        macro: {
                            id: 1,
                            name: 'Az én: első'
                        },
                        type: 'macro',
                    },
                    {
                        macro: {
                            id: 2,
                            name: 'Az én: második'
                        },
                        type: 'macro',
                    }
                ]
            }
        ])
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

        assert.deepStrictEqual(result, [
            {
                type: 'group',
                label: 'Open',
                path: 'Open',
                children: [
                    {
                        macro: {
                            id: 1,
                            name: 'Open daily sites',
                        },
                        type: 'macro',
                    },
                    {
                        macro: {
                            id: 2,
                            name: 'Open weekly sites',
                        },
                        type: 'macro',
                    }
                ]
            }
        ])
    });

    it('places a macro named like a group inside that group', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom'),
            createMacro(2, 'Doom: Chainsaw'),
            createMacro(3, 'Doom: Plasma gun'),
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.deepStrictEqual(result, [
            {
                type: 'group',
                label: 'Doom',
                path: 'Doom',
                children: [
                    {
                        macro: {
                            id: 1,
                            name: 'Doom',
                        },
                        type: 'macro',
                    },
                    {
                        macro: {
                            id: 2,
                            name: 'Doom: Chainsaw',
                        },
                        type: 'macro',
                    },
                    {
                        macro: {
                            id: 3,
                            name: 'Doom: Plasma gun',
                        },
                        type: 'macro',
                    },
                ],
            }
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

        assert.deepStrictEqual(result, [
            {
                type: 'group',
                label: 'Open',
                path: 'Open',
                children: [
                    {
                        type: 'group',
                        label: 'daily',
                        path: 'Open/daily',
                        children: [
                            {
                                macro: {
                                    id: 1,
                                    name: 'Open: daily',
                                },
                                type: 'macro',
                            },
                            {
                                macro: {
                                    id: 3,
                                    name: 'Open: daily: evening',
                                },
                                type: 'macro',
                            },
                            {
                                macro: {
                                    id: 2,
                                    name: 'Open: daily: morning',
                                },
                                type: 'macro',
                            },
                        ],
                    },
                ]
            }
        ])
    });

    it('keeps a same-named macro outside when the group is not created', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom'),
            createMacro(2, 'Doom: Chainsaw'),
        ];

        const result = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.deepStrictEqual(result, [
            {
                type: 'macro',
                macro: {
                    id: 1,
                    name: 'Doom',
                }
            },
            {
                type: 'macro',
                macro: {
                    id: 2,
                    name: 'Doom: Chainsaw',
                }
            },
        ]);
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

        assert.deepStrictEqual(findMacroGroupAncestorPaths(tree, 1), ['Open']);
        assert.deepStrictEqual(findMacroGroupAncestorPaths(tree, 2), ['Open']);
    });

    it('returns an empty array for macros that are not grouped', ({ assert }) => {
        const macros = [
            createMacro(1, 'Doom'),
            createMacro(2, 'Chainsaw'),
        ];
        const tree = groupMacrosByName(macros, ENABLED_MACRO_GROUPING_SETTINGS);

        assert.deepStrictEqual(findMacroGroupAncestorPaths(tree, 1), []);
    });

    it('returns null when the macro is not in the tree', ({ assert }) => {
        const tree = groupMacrosByName([createMacro(1, 'Doom: Chainsaw')], ENABLED_MACRO_GROUPING_SETTINGS);

        assert.strictEqual(findMacroGroupAncestorPaths(tree, 99), null);
    });
});

describe('normalizeMacroGroupingSettings', () => {
    it('clamps maxDepth to the supported sidebar layout limit', ({ assert }) => {
        const result = normalizeMacroGroupingSettings({ maxDepth: 99 });

        assert.strictEqual(result.maxDepth, MACRO_GROUPING_MAX_DEPTH);
    });
});
