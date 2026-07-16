import {
    DEFAULT_MACRO_GROUPING_SETTINGS,
    MACRO_GROUPING_MIN_DEPTH,
    MacroGroupingSettings,
} from 'uhk-common';

import { GroupableMacroItem, MacroMenuTreeNode } from '../models/macro-menu-tree-node';

export type { GroupableMacroItem };

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

interface MacroGroupingItem<TMacro extends GroupableMacroItem> {
    groupingName: string;
    macro: TMacro;
}

interface GroupMacrosAtLevelOptions<TMacro extends GroupableMacroItem> {
    depth: number;
    items: MacroGroupingItem<TMacro>[];
    parentPath: string;
    settings: MacroGroupingSettings;
}

const MACRO_NAME_SEPARATOR = /[^\p{L}\p{N}$]+/u;
const LEADING_MACRO_NAME_SEPARATOR = /^[^\p{L}\p{N}$]+/u;

export function groupMacrosByName<TMacro extends GroupableMacroItem>(
    macros: TMacro[],
    settings: MacroGroupingSettings
): MacroMenuTreeNode<TMacro>[] {
    const normalizedSettings = normalizeMacroGroupingSettings(settings);

    if (!normalizedSettings.enabled || macros.length === 0) {
        return macros.map(macro => ({ type: 'macro', macro }));
    }

    const items = macros.map(macro => ({
        groupingName: macro.name,
        macro
    }));

    return groupMacrosAtLevel({
        items,
        settings: normalizedSettings,
        depth: 0,
        parentPath: '',
    });
}

function groupMacrosAtLevel<TMacro extends GroupableMacroItem>(
    options: GroupMacrosAtLevelOptions<TMacro>
): MacroMenuTreeNode<TMacro>[] {
    const { depth, items, parentPath, settings } = options;
    const sortedItems = [...items].sort((a, b) => a.groupingName.localeCompare(b.groupingName));

    if (depth >= settings.maxDepth) {
        return sortedItems.map(item => createMacroNode(item));
    }

    const ungrouped: MacroMenuTreeNode<TMacro>[] = [];
    const ungroupedItems: MacroGroupingItem<TMacro>[] = [];
    const groups = new Map<string, { item: MacroGroupingItem<TMacro>; rest: string }[]>();

    for (const item of sortedItems) {
        const split = splitFirstSegment(item.groupingName, settings.camelCaseSeparation);
        if (!split) {
            ungroupedItems.push(item);
            continue;
        }
        const bucket = groups.get(split.head) ?? [];
        bucket.push({ item, rest: split.rest });
        groups.set(split.head, bucket);
    }

    const remainingUngroupedItems: MacroGroupingItem<TMacro>[] = [];

    for (const item of ungroupedItems) {
        let grouped = false;

        for (const [head, bucket] of groups) {
            if (bucket.length >= settings.minChildren && item.groupingName === head) {
                bucket.push({ item, rest: '' });
                grouped = true;
                break;
            }
        }

        if (!grouped) {
            remainingUngroupedItems.push(item);
        }
    }

    const groupedNodes: MacroMenuTreeNode<TMacro>[] = [];

    for (const [head, bucket] of groups) {
        if (bucket.length < settings.minChildren) {
            for (const { item } of bucket) {
                remainingUngroupedItems.push(item);
            }
            continue;
        }

        const groupPath = parentPath ? `${parentPath}/${head}` : head;
        const childItems = bucket.map(({ item, rest }) => ({ groupingName: rest, macro: item.macro }));

        groupedNodes.push({
            type: 'group',
            children: groupMacrosAtLevel({
                items: childItems,
                settings,
                depth: depth + 1,
                parentPath: groupPath,
            }),
            label: head,
            path: groupPath,
        });
    }

    for (const item of remainingUngroupedItems) {
        ungrouped.push(createMacroNode(item));
    }

    return sortMacroMenuTreeNodes([...ungrouped, ...groupedNodes]);
}

function createMacroNode<TMacro extends GroupableMacroItem>(
    item: MacroGroupingItem<TMacro>
): MacroMenuTreeNode<TMacro> {
    return {
        type: 'macro',
        macro: item.macro
    };
}

function sortMacroMenuTreeNodes<TMacro extends GroupableMacroItem>(
    nodes: MacroMenuTreeNode<TMacro>[]
): MacroMenuTreeNode<TMacro>[] {
    return [...nodes].sort((first, second) => getMacroMenuTreeNodeLabel(first).localeCompare(getMacroMenuTreeNodeLabel(second)));
}

function getMacroMenuTreeNodeLabel<TMacro extends GroupableMacroItem>(node: MacroMenuTreeNode<TMacro>): string {
    if (node.type === 'group') {
        return node.label;
    }

    return node.macro.name;
}

export function findMacroGroupAncestorPaths<TMacro extends GroupableMacroItem>(
    nodes: MacroMenuTreeNode<TMacro>[],
    macroId: number,
    ancestorPaths: string[] = []
): string[] | null {
    for (const node of nodes) {
        if (node.type === 'macro' && node.macro.id === macroId) {
            return ancestorPaths;
        }

        if (node.type === 'group') {
            const found = findMacroGroupAncestorPaths(
                node.children,
                macroId,
                [...ancestorPaths, node.path]
            );

            if (found !== null) {
                return found;
            }
        }
    }

    return null;
}

export function splitMacroName(name: string, camelCaseSeparation: boolean): string[] {
    let parts = name.split(MACRO_NAME_SEPARATOR).filter(part => part.length > 0);

    if (camelCaseSeparation) {
        parts = parts.flatMap(splitCamelCaseSegment);
    }

    return parts;
}

function splitCamelCaseSegment(segment: string): string[] {
    const parts: string[] = [];
    let current = '';

    for (let index = 0; index < segment.length; index++) {
        const character = segment[index];

        if (index > 0
            && /[A-Z]/.test(character)
            && current.length > 0
            && /[a-z0-9]$/.test(current)) {
            parts.push(current);
            current = character;
        } else {
            current += character;
        }
    }

    if (current.length > 0) {
        parts.push(current);
    }

    return parts.length > 0 ? parts : [segment];
}

function splitFirstSegment(
    name: string,
    camelCaseSeparation: boolean
): { head: string; rest: string } | null {
    const segments = splitMacroName(name, camelCaseSeparation);
    if (segments.length <= 1) {
        return null;
    }

    const head = segments[0];
    const afterHead = name.slice(name.indexOf(head) + head.length);
    const rest = afterHead.replace(LEADING_MACRO_NAME_SEPARATOR, '');

    return { head, rest };
}
