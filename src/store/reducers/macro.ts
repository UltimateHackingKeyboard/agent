import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Macro } from '../../config-serializer/config-items/Macro';

import { MacroActions } from '../actions';
import { AppState, MacroState } from '../index';

const initialState: MacroState = {
    entities: []
};

export default function (state = initialState, action: Action): MacroState {
    let newMacro: Macro;
    let newState: Macro[];

    switch (action.type) {
        case MacroActions.ADD:
            newMacro = new Macro();
            newMacro.id = generateId(state.entities);
            newMacro.name = generateName(state.entities, 'New macro');
            newMacro.isLooped = false;
            newMacro.isPrivate = true;
            newMacro.macroActions = [];

            return {
                entities: [...state.entities, newMacro]
            };

        case MacroActions.DUPLICATE:

            newMacro = new Macro(action.payload);
            newMacro.name = generateName(state.entities, newMacro.name);
            newMacro.id = generateId(state.entities);

            return {
                entities: [...state.entities, newMacro]
            };

        case MacroActions.EDIT_NAME:
            let name: string = generateName(state.entities, action.payload.name);

            newState = state.entities.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    macro.name = name;
                }

                return macro;
            });

            return {
                entities: newState
            };

        case MacroActions.REMOVE:
            newState = state.entities.filter((macro: Macro) => macro !== action.payload);

            return {
                entities: newState
            };

        case MacroActions.ADD_ACTION:
            newState = state.entities.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    newMacro = new Macro(macro);
                    newMacro.macroActions.push(action.payload.action);

                    return newMacro;
                }

                return macro;
            });

            return {
                entities: newState
            };

        case MacroActions.SAVE_ACTION:
            newState = state.entities.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    newMacro = new Macro(macro);
                    newMacro.macroActions[action.payload.index] = action.payload.action;

                    return newMacro;
                }

                return macro;
            });

            return {
                entities: newState
            };

        case MacroActions.DELETE_ACTION:
            newState = state.entities.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    newMacro = new Macro(macro);
                    newMacro.macroActions.splice(action.payload.index, 1);

                    return newMacro;
                }

                return macro;
            });

            return {
                entities: newState
            };

        case MacroActions.REORDER_ACTION:
            newState = state.entities.map((macro: Macro) => {
                if (macro.id === action.payload.id) {
                    let newIndex: number = action.payload.newIndex;

                    // We need to reduce the new index for one when we are moving action down
                    if (newIndex > action.payload.oldIndex) {
                        --newIndex;
                    }

                    newMacro = new Macro(macro);
                    newMacro.macroActions.splice(
                        newIndex,
                        0,
                        newMacro.macroActions.splice(action.payload.oldIndex, 1)[0]
                    );

                    return newMacro;
                }

                return macro;
            });

            return {
                entities: newState
            };

        default:
            return state;
    }
}

export function getMacroEntities(): (state$: Observable<AppState>) => Observable<Macro[]> {
    return (state$: Observable<AppState>) => state$
        .select(state => state.macros.entities);
}

export function getMacro(id: number) {
    if (isNaN(id)) {
        return () => Observable.of<Macro>(undefined);
    } else {
        return (state$: Observable<AppState>) => state$
            .select(appState => appState.macros.entities)
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
