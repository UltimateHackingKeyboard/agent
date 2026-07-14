import { MacroGroupingSettings, normalizeMacroGroupingSettings } from '../models/macro-grouping-settings.js';

export interface GroupableMacroItem {
    id: number;
    name: string;
}

export interface MacroMenuTreeNode<TMacro extends GroupableMacroItem = GroupableMacroItem> {
    children?: MacroMenuTreeNode<TMacro>[];
    label?: string;
    macro?: TMacro;
    path?: string;
    type: 'group' | 'macro';
}

interface MacroGroupingItem<TMacro extends GroupableMacroItem> {
    groupingName: string;
    macro: TMacro;
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

    return groupMacrosAtLevel(items, normalizedSettings, 0, '');
}

function groupMacrosAtLevel<TMacro extends GroupableMacroItem>(
    items: MacroGroupingItem<TMacro>[],
    settings: MacroGroupingSettings,
    depth: number,
    parentPath: string
): MacroMenuTreeNode<TMacro>[] {
    const sortedItems = items.toSorted((a, b) => a.groupingName.localeCompare(b.groupingName));

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
            children: groupMacrosAtLevel(childItems, settings, depth + 1, groupPath),
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
        return node.label || '';
    }

    return node.macro?.name || '';
}

export function findMacroGroupAncestorPaths<TMacro extends GroupableMacroItem>(
    nodes: MacroMenuTreeNode<TMacro>[],
    macroId: number,
    ancestorPaths: string[] = []
): string[] | null {
    for (const node of nodes) {
        if (node.type === 'macro' && node.macro?.id === macroId) {
            return ancestorPaths;
        }

        if (node.type === 'group' && node.path && node.children) {
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
