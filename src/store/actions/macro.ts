import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class MacroActions {
    static PREFIX = '[Macro] ';
    static GET_ALL = MacroActions.PREFIX + 'Get all macros';
    getAll(): Action {
        return {
            type: MacroActions.GET_ALL
        };
    }
}
