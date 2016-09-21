import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Macro } from '../../config-serializer/config-items/Macro';

import { MacroActions } from '../actions';
import { AppState } from '../index';

const initialState: Macro[] = [];

export default function(state = initialState, action: Action): Macro[] {
    switch (action.type) {
        case MacroActions.DUPLICATE:

            let newMacro: Macro = new Macro(action.payload);
            newMacro.name = generateName(state, newMacro.name);
            newMacro.id = generateId(state);

            return [...state, newMacro];

        case MacroActions.EDIT_NAME:
            let name: string = generateName(state, action.payload.name);

            return state.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    macro.name = name;
                }

                return macro;
            });

        case MacroActions.REMOVE:
            return state.filter((macro: Macro) => macro.id !== action.payload);

        default: {
            return state;
        }
    }
}

export function getMacro(id: number) {
    // Convert to real number
    id = +id;

    if (isNaN(id)) {
        return (state$: Observable<AppState>) => state$
            .select(appState => appState.macros)
            .map((macros: Macro[]) => {
                if (macros.length > 0) {
                    return macros[0];
                } else {
                    return undefined;
                }
            });
    } else {
        return (state$: Observable<AppState>) => state$
            .select(appState => appState.macros)
            .map((macros: Macro[]) => macros.find((macro: Macro) => macro.id === id));
    }
}

function generateName(macros: Macro[], name: string) {
    let suffix = 2;
    const oldName: string = name;

    while (macros.some((macro: Macro) => macro.name === name)) {
        name = oldName + ` (${suffix})`;
        ++suffix;
    }

    return name;
}

function generateId(macros: Macro[]) {
    let newId = 0;

    macros.forEach((macro: Macro) => {
        if (macro.id > newId) {
            newId = macro.id;
        }
    });

    return ++newId;

}
