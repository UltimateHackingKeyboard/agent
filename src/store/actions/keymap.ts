import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';

@Injectable()
export class KeymapActions {
    static PREFIX = '[Keymap] ';

    static ADD = KeymapActions.PREFIX + 'Add keymap';
    static DUPLICATE = KeymapActions.PREFIX + 'Duplicate keymap';
    static EDIT_ABBR = KeymapActions.PREFIX + 'Edit keymap abbreviation';
    static EDIT_TITLE = KeymapActions.PREFIX + 'Edit keymap title';
    static SET_DEFAULT = KeymapActions.PREFIX + 'Set default option';
    static REMOVE = KeymapActions.PREFIX + 'Remove keymap';

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
