import { Action } from '@ngrx/store';

export namespace MacroActions {
    export const PREFIX = '[Macro] ';
    export const GET_ALL = MacroActions.PREFIX + 'Get all macros';

    export function getAll(): Action {
        return {
            type: MacroActions.GET_ALL
        };
    }
}
