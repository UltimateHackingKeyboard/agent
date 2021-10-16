import { Action } from '@ngrx/store';
import { Keymap } from 'uhk-common';

import { ChangeKeymapDescription } from '../../models/ChangeKeymapDescription';
import { KeyActionRemap } from '../../models/key-action-remap';
import { UndoUserConfigData } from '../../models/undo-user-config-data';
import { ExchangeKeysActionModel } from '../../models';

export enum ActionTypes {
    Add = '[Keymap] Add keymap',
    Duplicate = '[Keymap] Duplicate keymap',
    EditAbbr = '[Keymap] Edit keymap abbreviation',
    EditName = '[Keymap] Edit keymap title',
    ExchangeKeys = '[Keymap] Exchange keys action',
    SaveKey = '[Keymap] Save key action',
    SetDefault = '[Keymap] Set default option',
    Remove = '[Keymap] Remove keymap',
    CheckMacro = '[Keymap] Check deleted macro',
    EditDescription = '[Keymap] Edit description',
    UndoLastAction = '[Keymap] Undo last action',
    Select = '[Keymap] Select keymap action'
}

export class AddKeymapAction implements Action {
    type = ActionTypes.Add;

    constructor(public payload: Keymap) {
    }
}

export class DuplicateKeymapAction implements Action {
    type = ActionTypes.Duplicate;

    constructor(public payload: Keymap) {
    }
}

export class EditKeymapAbbreviationAction implements Action {
    type = ActionTypes.EditAbbr;

    constructor(public payload: {
        abbr: string;
        newAbbr: string;
        name: string;
    }) {
    }
}

export class EditKeymapNameAction implements Action {
    type = ActionTypes.EditName;

    constructor(public payload: {
        abbr: string;
        name: string;
    }) {
    }
}

export class SaveKeyAction implements Action {
    type = ActionTypes.SaveKey;

    constructor(public payload: {
        keymap: Keymap;
        layer: number;
        module: number;
        key: number;
        keyAction: KeyActionRemap;
    }) {
    }
}

export class ExchangeKeysAction implements Action {
    type = ActionTypes.ExchangeKeys;

    constructor(public payload: ExchangeKeysActionModel) {
    }
}

export class SetDefaultKeymapAction implements Action {
    type = ActionTypes.SetDefault;

    constructor(public payload: string) {
    }
}

export class RemoveKeymapAction implements Action {
    type = ActionTypes.Remove;

    constructor(public payload: string) {
    }
}

export class CheckMacroAction implements Action {
    type = ActionTypes.CheckMacro;

    constructor(public payload: number) {
    }
}

export class EditDescriptionAction implements Action {
    type = ActionTypes.EditDescription;

    constructor(public payload: ChangeKeymapDescription) {
    }
}

export class UndoLastAction implements Action {
    type = ActionTypes.UndoLastAction;

    constructor(public payload: UndoUserConfigData) {
    }
}

export class SelectKeymapAction implements Action {
    type = ActionTypes.Select;

    constructor(public payload: string) {
    }
}

export type Actions
    = AddKeymapAction
    | DuplicateKeymapAction
    | EditKeymapAbbreviationAction
    | EditKeymapNameAction
    | ExchangeKeysAction
    | SaveKeyAction
    | SetDefaultKeymapAction
    | RemoveKeymapAction
    | CheckMacroAction
    | EditDescriptionAction
    | UndoLastAction
    | SelectKeymapAction
    ;
