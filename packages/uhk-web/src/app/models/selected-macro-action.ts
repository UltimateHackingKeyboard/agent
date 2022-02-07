export enum TabName {
    Keypress,
    Text,
    Mouse,
    Delay,
    Command
}

export type SelectedMacroActionId = string | number; // 'new' if the macro currently adding

export interface SelectedMacroAction {
    id: SelectedMacroActionId;
    type: TabName;
}
