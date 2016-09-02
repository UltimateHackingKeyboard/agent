import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class PresetActions {
    static GET_ALL = '[Preset] Get all macros';
    getAll(): Action {
        return {
            type: PresetActions.GET_ALL
        };
    }
}
