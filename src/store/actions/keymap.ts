import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class KeymapActions {
    static GET_ALL = '[Keymap] Get all keymaps';
    static IS_DEFAULT = '[Keymap] Set default option';

    getAll(): Action {
        return {
            type: KeymapActions.GET_ALL
        };
    }

    isDefault(deafult: boolean): Action {
        return {
            type: KeymapActions.IS_DEFAULT,
            payload: deafult
        };
    }
}
