import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class KeymapActions {
    static IS_DEFAULT = '[Keymap] Set default option';
    isDefault(deafult: boolean): Action {
        return {
            type: KeymapActions.IS_DEFAULT,
            payload: deafult
        };
    }

    /*static GET_SINGLE = '[Keymap] Get single keymap';
    getKeymap(id: string): Action {
        return {
            type: KeymapActions.GET_SINGLE,
            payload: id
        };
    }

    static GET_ALL = '[Keymap] Get all keymaps';
    getKeymaps(): Action {
        return {
            type: KeymapActions.GET_ALL
        };
    }*/
}
