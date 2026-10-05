import { MacroMenuItem } from './macro-menu-item';

export interface GroupableMacroItem {
    id: number;
    name: string;
}

export interface MacroMenuTreeGroupNode<TMacro extends GroupableMacroItem = MacroMenuItem> {
    children: MacroMenuTreeNode<TMacro>[];
    label: string;
    path: string;
    type: 'group';
}

export interface MacroMenuTreeMacroNode<TMacro extends GroupableMacroItem = MacroMenuItem> {
    macro: TMacro;
    type: 'macro';
}

export type MacroMenuTreeNode<TMacro extends GroupableMacroItem = MacroMenuItem> =
    MacroMenuTreeGroupNode<TMacro> | MacroMenuTreeMacroNode<TMacro>;
