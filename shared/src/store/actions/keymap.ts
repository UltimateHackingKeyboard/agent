import { Action } from '@ngrx/store';

import { KeyAction } from '../../config-serializer/config-items/key-action';
import { Keymap } from '../../config-serializer/config-items/Keymap';
import { Macro } from '../../config-serializer/config-items/Macro';

export namespace KeymapActions {
    export const PREFIX = '[Keymap] ';
    export const ADD = KeymapActions.PREFIX + 'Add keymap';
    export const DUPLICATE = KeymapActions.PREFIX + 'Duplicate keymap';
    export const EDIT_ABBR = KeymapActions.PREFIX + 'Edit keymap abbreviation';
    export const EDIT_NAME = KeymapActions.PREFIX + 'Edit keymap title';
    export const SAVE_KEY = KeymapActions.PREFIX + 'Save key action';
    export const SET_DEFAULT = KeymapActions.PREFIX + 'Set default option';
    export const REMOVE = KeymapActions.PREFIX + 'Remove keymap';
    export const CHECK_MACRO = KeymapActions.PREFIX + 'Check deleted macro';
    export const LOAD_KEYMAPS = KeymapActions.PREFIX + 'Load keymaps';
    export const LOAD_KEYMAPS_SUCCESS = KeymapActions.PREFIX + 'Load keymaps success';

    export function loadKeymaps(): Action {
        return {
            type: KeymapActions.LOAD_KEYMAPS
        };
    }

    export function loadKeymapsSuccess(keymaps: Keymap[]): Action {
        return {
            type: KeymapActions.LOAD_KEYMAPS_SUCCESS,
            payload: keymaps
        };
    }

    export function addKeymap(item: Keymap): Action {
        return {
            type: KeymapActions.ADD,
            payload: item
        };
    }

    export function setDefault(abbr: string): Action {
        return {
            type: KeymapActions.SET_DEFAULT,
            payload: abbr
        };
    }

    export function removeKeymap(abbr: string): Action {
        return {
            type: KeymapActions.REMOVE,
            payload: abbr
        };
    }

    export function duplicateKeymap(keymap: Keymap): Action {
        return {
            type: KeymapActions.DUPLICATE,
            payload: keymap
        };
    }

    export function editKeymapName(abbr: string, name: string): Action {
        return {
            type: KeymapActions.EDIT_NAME,
            payload: {
                abbr: abbr,
                name: name
            }
        };
    }

    export function editKeymapAbbr(abbr: string, newAbbr: string): Action {
        return {
            type: KeymapActions.EDIT_ABBR,
            payload: {
                abbr: abbr,
                newAbbr: newAbbr
            }
        };
    }

    export function saveKey(keymap: Keymap, layer: number, module: number, key: number, keyAction: KeyAction): Action {
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

    export function checkMacro(macro: Macro): Action {
        return {
            type: KeymapActions.CHECK_MACRO,
            payload: macro
        };
    }
}
