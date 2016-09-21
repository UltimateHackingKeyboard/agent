import { Action } from '@ngrx/store';

import { Macro } from '../../config-serializer/config-items/Macro';

export namespace MacroActions {
    export const PREFIX = '[Macro] ';

    export const DUPLICATE = MacroActions.PREFIX + 'Duplicate macro';
    export const EDIT_NAME = MacroActions.PREFIX + 'Edit macro title';
    export const REMOVE = MacroActions.PREFIX + 'Remove macro';

    export const SAVE_ITEM = MacroActions.PREFIX + 'Save macro item';
    export const DELETE_ITEM = MacroActions.PREFIX + 'Delete macro item';

    export function removeMacro(id: number): Action {
        return {
            type: MacroActions.REMOVE,
            payload: id
        };
    }

    export function duplicateMacro(macro: Macro): Action {
        return {
            type: MacroActions.DUPLICATE,
            payload: macro
        };
    }

    export function editMacroName(id: number, name: string): Action {
        return {
            type: MacroActions.EDIT_NAME,
            payload: {
                id: id,
                name: name
            }
        };
    }

    export function saveMacroItem(macro: Macro): Action {
        return {
            type: MacroActions.SAVE_ITEM,
            payload: macro
        };
    }
    export function deleteMacroItem(macro: Macro): Action {
        return {
            type: MacroActions.DELETE_ITEM,
            payload: macro
        };
    }
}
