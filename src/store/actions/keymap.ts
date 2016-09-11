import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';

@Injectable()
export class KeymapActions {
    static ADD = '[Keymap] Add keymap';
    static DUPLICATE = '[Keymap] Remove keymap';
    static EDIT_ABBR = '[Keymap] Edit keymap abbreviation';
    static EDIT_TITLE = '[Keymap] Edit keymap title';
    static SET_DEFAULT = '[Keymap] Set default option';
    static REMOVE = '[Keymap] Remove keymap';

    add(item: Keymap): Action {
        return {
            type: KeymapActions.ADD,
            payload: item
        };
    }

    setDefault(id: string): Action {
        return {
            type: KeymapActions.SET_DEFAULT,
            payload: id
        };
    }

    removeKeymap(id: string): Action {
        return {
            type: KeymapActions.REMOVE,
            payload: id
        };
    }

    duplicateKeymap(keymap: Keymap): Action {
        return {
            type: KeymapActions.DUPLICATE,
            payload: keymap
        };
    }

    editTitleKeymap(id: string, title: string): Action {
        return {
            type: KeymapActions.EDIT_TITLE,
            payload: {
                id: id,
                title: title
            }
        };
    }

    editAbbrKeymap(id: string, abbr: string): Action {
        return {
            type: KeymapActions.EDIT_ABBR,
            payload: {
                id: id,
                abbr: abbr
            }
        };
    }
}
