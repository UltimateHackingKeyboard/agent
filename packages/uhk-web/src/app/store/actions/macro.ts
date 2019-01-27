import { Action } from '@ngrx/store';
import { Macro, MacroAction as ConfigItemMacroAction } from 'uhk-common';

export type MacroAction = Action & { payload?: any };

export namespace MacroActions {
    export const PREFIX = '[Macro] ';

    export const DUPLICATE = MacroActions.PREFIX + 'Duplicate macro';
    export const EDIT_NAME = MacroActions.PREFIX + 'Edit macro title';
    export const REMOVE = MacroActions.PREFIX + 'Remove macro';
    export const ADD = MacroActions.PREFIX + 'Add macro';

    export const ADD_ACTION = MacroActions.PREFIX + 'Add macro action';
    export const SAVE_ACTION = MacroActions.PREFIX + 'Save macro action';
    export const DELETE_ACTION = MacroActions.PREFIX + 'Delete macro action';
    export const REORDER_ACTION = MacroActions.PREFIX + 'Reorder macro action';

    export function addMacro(): MacroAction {
        return {
            type: MacroActions.ADD,
        };
    }

    export function removeMacro(macroId: number): MacroAction {
        return {
            type: MacroActions.REMOVE,
            payload: macroId,
        };
    }

    export function duplicateMacro(macro: Macro): MacroAction {
        return {
            type: MacroActions.DUPLICATE,
            payload: macro,
        };
    }

    export function editMacroName(id: number, name: string): MacroAction {
        return {
            type: MacroActions.EDIT_NAME,
            payload: {
                id: id,
                name: name,
            },
        };
    }

    export function addMacroAction(id: number, action: ConfigItemMacroAction): MacroAction {
        return {
            type: MacroActions.ADD_ACTION,
            payload: {
                id: id,
                action: action,
            },
        };
    }

    export function saveMacroAction(id: number, index: number, action: ConfigItemMacroAction): MacroAction {
        return {
            type: MacroActions.SAVE_ACTION,
            payload: {
                id: id,
                index: index,
                action: action,
            },
        };
    }

    export function deleteMacroAction(id: number, index: number, action: ConfigItemMacroAction): MacroAction {
        return {
            type: MacroActions.DELETE_ACTION,
            payload: {
                id: id,
                index: index,
                action: action,
            },
        };
    }

    export function reorderMacroAction(id: number, oldIndex: number, newIndex: number): MacroAction {
        return {
            type: MacroActions.REORDER_ACTION,
            payload: {
                id: id,
                oldIndex: oldIndex,
                newIndex: newIndex,
            },
        };
    }
}
