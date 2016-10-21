import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { KeymapActions } from '../actions';
import { AppState, KeymapState } from '../index';

const initialState: KeymapState = {
    entities: []
};

export default function(state = initialState, action: Action): KeymapState {
    let newState: Keymap[];

    switch (action.type) {
        case KeymapActions.ADD:
        case KeymapActions.DUPLICATE:

            let newKeymap: Keymap = new Keymap(action.payload);

            newKeymap.abbreviation = generateAbbr(state.entities, newKeymap.abbreviation);
            newKeymap.name = generateName(state.entities, newKeymap.name);
            newKeymap.isDefault = (state.entities.length === 0);

            return {
                entities: [...state.entities, newKeymap]
            };

        case KeymapActions.EDIT_NAME:
            let name: string = generateName(state.entities, action.payload.name);

            newState = state.entities.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbr) {
                    keymap.name = name;
                }

                return keymap;
            });

            return {
                entities: newState
            };

        case KeymapActions.EDIT_ABBR:
            let abbr: string = generateAbbr(state.entities, action.payload.newAbbr);

            newState = state.entities.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbr) {
                    keymap.abbreviation = abbr;
                }

                return keymap;
            });

            return {
                entities: newState,
                newAbbr: abbr
            };

        case KeymapActions.SET_DEFAULT:
            newState = state.entities.map((keymap: Keymap) => {
                keymap.isDefault = (keymap.abbreviation === action.payload);

                return keymap;
            });

            return {
                entities: newState
            };

        case KeymapActions.REMOVE:
            let isDefault: boolean;

            let filtered: Keymap[] = state.entities.filter((keymap: Keymap) => {
                    if (keymap.abbreviation === action.payload) {
                        isDefault = keymap.isDefault;
                        return false;
                    }

                    return true;
                }
            );

            // If deleted one is default set default keymap to the first on the list of keymaps
            if (isDefault && filtered.length > 0) {
                filtered[0].isDefault = true;
            }

            return {
                entities: filtered
            };

        case KeymapActions.SAVE_KEY:
            let changedKeymap: Keymap = new Keymap;

            newState = state.entities.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbreviation) {
                    keymap = Object.assign(changedKeymap, action.payload);
                }

                return keymap;
            });

            return {
                entities: newState
            };

        default: {
            return state;
        }
    }
}

export function getKeymapEntities(): (state$: Observable<AppState>) => Observable<Keymap[]> {
    return (state$: Observable<AppState>) => state$
        .select(state => state.keymaps.entities);
}

export function getKeymap(abbr: string) {
    if (abbr === undefined) {
        return getDefault();
    }

    return (state$: Observable<AppState>) => state$
        .select(appState => appState.keymaps.entities)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.abbreviation === abbr)
        );
}

export function getDefault() {
    return (state$: Observable<AppState>) => state$
        .select(appState => appState.keymaps.entities)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.isDefault)
        );
}

function generateAbbr(keymaps: Keymap[], abbr: string): string {
    const chars: string[] = '23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let position = 0;

    while (keymaps.some((keymap: Keymap) => keymap.abbreviation === abbr)) {
        abbr = abbr.substring(0, abbr.length - 1) + chars[position];
        ++position;
    }

    return abbr;
}

function generateName(keymaps: Keymap[], name: string) {
    let suffix = 2;

    if (name.search(/\(\d\)/) > -1) {
        name = name.replace(/\(\d\)/, '').trim();
    }

    const oldName: string = name;

    while (keymaps.some((keymap: Keymap) => keymap.name === name)) {
        name = oldName + ` (${suffix})`;
        ++suffix;
    }

    return name;
}
