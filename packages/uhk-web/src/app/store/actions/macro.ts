import { Action } from '@ngrx/store';
import { Macro, MacroAction as ConfigItemMacroAction } from 'uhk-common';

export enum ActionTypes {
    Duplicate = '[Macro] Duplicate macro',
    EditName = '[Macro] Edit macro title',
    Remove = '[Macro] Remove macro',
    Add = '[Macro] Add macro',
    Select = '[Macro] Select macro',

    AddAction = '[Macro] Add macro action',
    SaveAction = '[Macro] Save macro action',
    DeleteAction = '[Macro] Delete macro action',
    ReorderAction = '[Macro] Reorder macro action'
}

export class DuplicateMacroAction implements Action {
    type = ActionTypes.Duplicate;

    constructor(public payload: Macro) {
    }
}

export class AddMacroAction implements Action {
    type = ActionTypes.Add;
}

export class RemoveMacroAction implements Action {
    type = ActionTypes.Remove;

    constructor(public payload: number) {
    }
}

export class EditMacroNameAction implements Action {
    type = ActionTypes.EditName;

    constructor(public payload: { id: number, name: string }) {
    }
}

export class SelectMacroAction implements Action {
    type = ActionTypes.Select;

    constructor(public payload: number) {
    }
}

export class AddMacroActionAction implements Action {
    type = ActionTypes.AddAction;

    constructor(public payload: { id: number, action: ConfigItemMacroAction }) {
    }
}

export class SaveMacroActionAction implements Action {
    type = ActionTypes.SaveAction;

    constructor(public payload: { id: number, index: number, action: ConfigItemMacroAction }) {
    }
}

export class DeleteMacroActionAction implements Action {
    type = ActionTypes.DeleteAction;

    constructor(public payload: { id: number, index: number, action: ConfigItemMacroAction }) {
    }
}

export class ReorderMacroActionAction implements Action {
    type = ActionTypes.ReorderAction;

    constructor(public payload: { id: number, oldIndex: number, newIndex: number }) {
    }
}

export type Actions
    = DuplicateMacroAction
    | AddMacroAction
    | RemoveMacroAction
    | EditMacroNameAction
    | SelectMacroAction
    | AddMacroActionAction
    | SaveMacroActionAction
    | DeleteMacroActionAction
    | ReorderMacroActionAction
    ;
