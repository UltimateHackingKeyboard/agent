import { MacroGroupingSettings, normalizeMacroGroupingSettings } from '../models/macro-grouping-settings.js';

export interface GroupableMacroItem {
    id: number;
    name: string;
}

export interface MacroMenuTreeNode<TMacro extends GroupableMacroItem = GroupableMacroItem> {
    children?: MacroMenuTreeNode<TMacro>[];
    displayName?: string;
    label?: string;
    macro?: TMacro;
    path?: string;
    type: 'group' | 'macro';
}

interface MacroGroupingItem<TMacro extends GroupableMacroItem> {
    groupingName: string;
    macro: TMacro;
}

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
    const sortedItems = [...items].sort((first, second) => first.groupingName.localeCompare(second.groupingName));

    if (depth >= settings.maxDepth) {
        return sortedItems.map(item => createMacroNode(item, depth));
    }

    const ungrouped: MacroMenuTreeNode<TMacro>[] = [];
    const groupMap = new Map<string, MacroGroupingItem<TMacro>[]>();
    const pendingGroups: Array<{
        groupKey: string;
        item: MacroGroupingItem<TMacro>;
        remainder: string;
    }> = [];

    for (const item of sortedItems) {
        const segments = splitMacroName(item.groupingName, settings.camelCaseSeparation);

        if (segments.length <= 1) {
            ungrouped.push(createMacroNode(item, depth));
            continue;
        }

        pendingGroups.push({
            groupKey: segments[0],
            item,
            remainder: getRemainder(item.groupingName, segments[0]),
        });
    }

    const groupCounts = new Map<string, number>();

    for (const pendingGroup of pendingGroups) {
        groupCounts.set(
            pendingGroup.groupKey,
            (groupCounts.get(pendingGroup.groupKey) || 0) + 1
        );
    }

    for (const pendingGroup of pendingGroups) {
        if ((groupCounts.get(pendingGroup.groupKey) || 0) < settings.minChildren) {
            ungrouped.push(createMacroNode(pendingGroup.item, depth));
            continue;
        }

        const groupedItems = groupMap.get(pendingGroup.groupKey) || [];
        groupedItems.push({
            groupingName: pendingGroup.remainder,
            macro: pendingGroup.item.macro
        });
        groupMap.set(pendingGroup.groupKey, groupedItems);
    }

    const groupedNodes = [...groupMap.entries()]
        .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
        .map(([groupKey, groupedItems]) => {
            const groupPath = parentPath ? `${parentPath}/${groupKey}` : groupKey;

            return {
                type: 'group' as const,
                children: groupMacrosAtLevel(groupedItems, settings, depth + 1, groupPath),
                label: groupKey,
                path: groupPath
            };
        });

    return sortMacroMenuTreeNodes([...ungrouped, ...groupedNodes]);
}

function createMacroNode<TMacro extends GroupableMacroItem>(
    item: MacroGroupingItem<TMacro>,
    depth: number
): MacroMenuTreeNode<TMacro> {
    return {
        type: 'macro',
        displayName: depth > 0 ? item.groupingName : undefined,
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

    return node.displayName || node.macro?.name || '';
}

export function splitMacroName(name: string, camelCaseSeparation: boolean): string[] {
    let parts = name.split(/[^a-zA-Z0-9$]+/).filter(part => part.length > 0);

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

function getRemainder(name: string, firstSegment: string): string {
    const separatorMatch = name.match(new RegExp(`^${escapeRegExp(firstSegment)}[^a-zA-Z0-9$]+(.+)$`));

    if (separatorMatch) {
        return separatorMatch[1];
    }

    if (name.startsWith(firstSegment) && name.length > firstSegment.length) {
        return name.slice(firstSegment.length);
    }

    const segments = splitMacroName(name, false);

    return segments.slice(1).join(' ');
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
