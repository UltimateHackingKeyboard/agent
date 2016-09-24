import { Action } from '@ngrx/store';

import { Macro } from '../../config-serializer/config-items/Macro';
import { MacroAction } from '../../config-serializer/config-items/macro-action/MacroAction';

export namespace MacroActions {
    export const PREFIX = '[Macro] ';

    export const DUPLICATE = MacroActions.PREFIX + 'Duplicate macro';
    export const EDIT_NAME = MacroActions.PREFIX + 'Edit macro title';
    export const REMOVE = MacroActions.PREFIX + 'Remove macro';

    export const ADD_ACTION = MacroActions.PREFIX + 'Add macro action';
    export const SAVE_ACTION = MacroActions.PREFIX + 'Save macro action';
    export const DELETE_ACTION = MacroActions.PREFIX + 'Delete macro action';

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

    export function addMacroAction(id: number, action: MacroAction): Action {
        return {
            type: MacroActions.ADD_ACTION,
            payload: {
                id: id,
                action: action
            }
        };
    }

    export function saveMacroAction(id: number, index: number, action: MacroAction): Action {
        return {
            type: MacroActions.SAVE_ACTION,
            payload: {
                id: id,
                index: index,
                action: action
            }
        };
    }

    export function deleteMacroAction(id: number, index: number, action: MacroAction): Action {
        return {
            type: MacroActions.DELETE_ACTION,
            payload: {
                id: id,
                index: index,
                action: action
            }
        };
    }
}
