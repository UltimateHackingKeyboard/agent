import { Action } from '@ngrx/store';

import { KeyAction } from '../../config-serializer/config-items/key-action';
import { Keymap } from '../../config-serializer/config-items/keymap';
import { Macro } from '../../config-serializer/config-items/macro';
import { UndoUserConfigData } from '../../models/undo-user-config-data';

export type KeymapAction =
    KeymapActions.AddKeymapAction |
    KeymapActions.DuplicateKeymapAction |
    KeymapActions.EditKeymapNameAction |
    KeymapActions.EditKeymapAbbreviationAction |
    KeymapActions.LoadKeymapSuccessAction |
    KeymapActions.SetDefaultAction |
    KeymapActions.RemoveKeymapAction |
    KeymapActions.SaveKeyAction |
    KeymapActions.UndoLastAction |
    KeymapActions.CheckMacroAction;

export namespace KeymapActions {
    export const ADD = '[Keymap] Add keymap';

    export type AddKeymapAction = {
        type: typeof ADD,
        payload: Keymap
    };

    export const DUPLICATE = '[Keymap] Duplicate keymap';

    export type DuplicateKeymapAction = {
        type: typeof DUPLICATE,
        payload: Keymap
    };

    export const EDIT_ABBR = '[Keymap] Edit keymap abbreviation';

    export type EditKeymapAbbreviationAction = {
        type: typeof EDIT_ABBR,
        payload: {
            abbr: string;
            newAbbr: string;
            name: string;
        }
    };

    export const EDIT_NAME = '[Keymap] Edit keymap title';

    export type EditKeymapNameAction = {
        type: typeof EDIT_NAME,
        payload: {
            abbr: string;
            name: string;
        }
    };

    export const SAVE_KEY = '[Keymap] Save key action';

    export type SaveKeyAction = {
        type: typeof SAVE_KEY,
        payload: {
            keymap: Keymap;
            layer: number;
            module: number;
            key: number;
            keyAction: KeyAction;
        }
    };

    export const SET_DEFAULT = '[Keymap] Set default option';

    export type SetDefaultAction = {
        type: typeof SET_DEFAULT,
        payload: string
    };

    export const REMOVE = '[Keymap] Remove keymap';

    export type RemoveKeymapAction = {
        type: typeof REMOVE,
        payload: string
    };

    export const CHECK_MACRO = '[Keymap] Check deleted macro';

    export type CheckMacroAction = {
        type: typeof CHECK_MACRO,
        payload: Macro
    };

    export const LOAD_KEYMAPS = '[Keymap] Load keymaps';
    export const LOAD_KEYMAPS_SUCCESS = '[Keymap] Load keymaps success';

    export type LoadKeymapSuccessAction = {
        type: typeof LOAD_KEYMAPS_SUCCESS,
        payload: Keymap[]
    };

    export const UNDO_LAST_ACTION = '[Keymap] Undo last action';

    export type UndoLastAction = {
        type: typeof UNDO_LAST_ACTION,
        payload: UndoUserConfigData
    };

    export function loadKeymaps(): Action {
        return {
            type: KeymapActions.LOAD_KEYMAPS
        };
    }

    export function loadKeymapsSuccess(keymaps: Keymap[]): LoadKeymapSuccessAction {
        return {
            type: KeymapActions.LOAD_KEYMAPS_SUCCESS,
            payload: keymaps
        };
    }

    export function addKeymap(item: Keymap): AddKeymapAction {
        return {
            type: KeymapActions.ADD,
            payload: item
        };
    }

    export function setDefault(abbr: string): SetDefaultAction {
        return {
            type: KeymapActions.SET_DEFAULT,
            payload: abbr
        };
    }

    export function removeKeymap(abbr: string): RemoveKeymapAction {
        return {
            type: KeymapActions.REMOVE,
            payload: abbr
        };
    }

    export function duplicateKeymap(keymap: Keymap): DuplicateKeymapAction {
        return {
            type: KeymapActions.DUPLICATE,
            payload: keymap
        };
    }

    export function editKeymapName(abbr: string, name: string): EditKeymapNameAction {
        return {
            type: KeymapActions.EDIT_NAME,
            payload: {
                abbr: abbr,
                name: name
            }
        };
    }

    export function editKeymapAbbr(name: string, abbr: string, newAbbr: string): EditKeymapAbbreviationAction {
        return {
            type: KeymapActions.EDIT_ABBR,
            payload: {
                name,
                abbr,
                newAbbr
            }
        };
    }

    export function saveKey(keymap: Keymap, layer: number, module: number, key: number, keyAction: KeyAction): SaveKeyAction {
        return {
            type: KeymapActions.SAVE_KEY,
            payload: {
                keymap,
                layer,
                module,
                key,
                keyAction
            }
        };
    }

    export function checkMacro(macro: Macro): CheckMacroAction {
        return {
            type: KeymapActions.CHECK_MACRO,
            payload: macro
        };
    }
}
