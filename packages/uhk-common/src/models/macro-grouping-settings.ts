export interface MacroGroupingSettings {
    camelCaseSeparation: boolean;
    enabled: boolean;
    maxDepth: number;
    minChildren: number;
}

export const MACRO_GROUPING_MIN_DEPTH = 1;

// Mirrors side-menu.component.scss ($side-menu-width, $macro-tree-base-indent, $macro-tree-indent-step).
const MACRO_TREE_SIDE_MENU_WIDTH_PX = 250;
const MACRO_TREE_LEVEL1_PADDING_PX = 24;
const MACRO_TREE_BASE_INDENT_PX = 32;
const MACRO_TREE_INDENT_STEP_PX = 12;
const MACRO_TREE_RESERVED_RIGHT_PX = 48;
const MACRO_TREE_MIN_LABEL_WIDTH_PX = 72;

/**
 * Deepest macro-tree depth the sidebar layout can fit before labels get too narrow.
 * The CSS indent is unbounded; this limit comes from the 250px sidebar width.
 */
export const MACRO_GROUPING_MAX_DEPTH = Math.max(
    MACRO_GROUPING_MIN_DEPTH,
    Math.floor(
        (MACRO_TREE_SIDE_MENU_WIDTH_PX
            - MACRO_TREE_LEVEL1_PADDING_PX
            - MACRO_TREE_BASE_INDENT_PX
            - MACRO_TREE_RESERVED_RIGHT_PX
            - MACRO_TREE_MIN_LABEL_WIDTH_PX)
        / MACRO_TREE_INDENT_STEP_PX
    )
);

export const DEFAULT_MACRO_GROUPING_SETTINGS: MacroGroupingSettings = {
    camelCaseSeparation: false,
    enabled: false,
    maxDepth: 1,
    minChildren: 2,
};

export function normalizeMacroGroupingSettings(
    settings?: Partial<MacroGroupingSettings>
): MacroGroupingSettings {
    const merged: MacroGroupingSettings = {
        ...DEFAULT_MACRO_GROUPING_SETTINGS,
        ...settings,
    };

    return {
        ...merged,
        maxDepth: Math.min(
            MACRO_GROUPING_MAX_DEPTH,
            Math.max(MACRO_GROUPING_MIN_DEPTH, merged.maxDepth)
        ),
        minChildren: Math.min(10, Math.max(2, merged.minChildren)),
    };
}
