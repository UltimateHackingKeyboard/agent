import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';

@Injectable()
export class KeymapActions {
    static IS_DEFAULT = '[Keymap] Set default option';
    static ADD = '[Keymap] Add keymap';

    add(item: Keymap): Action {
        return {
            type: KeymapActions.ADD,
            payload: item
        };
    }

    isDefault(deafult: boolean): Action {
        return {
            type: KeymapActions.IS_DEFAULT,
            payload: deafult
        };
    }
}
