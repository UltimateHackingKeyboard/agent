import { MacroAction } from 'uhk-common';

export enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay,
    Command
}

export interface SelectedMacroItem {
    type: TabName;
    macroAction: MacroAction
}

export type SelectedMacroActionId = string | number; // 'new' if the macro currently adding

export interface SelectedMacroAction {
    id: SelectedMacroActionId;
    type: TabName;
    macroAction: MacroAction
}
