import { MacroAction } from 'uhk-common';

export enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay,
    Command
}

export interface SelectedMacroItem {
    inlineEdit?: boolean;
    type: TabName;
    macroAction: MacroAction
}

export type SelectedMacroActionId = string | number; // 'new' if the macro currently adding

export interface SelectedMacroAction {
    id: SelectedMacroActionId;
    inlineEdit?: boolean;
    type: TabName;
    macroAction: MacroAction
}

export interface SelectedMacroActionIdModel {
    id: SelectedMacroActionId;
    inlineEdit?: boolean;
}
