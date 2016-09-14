import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { KeymapActions } from '../actions';
import { AppState } from '../index';

const initialState: Keymap[] = [];

export default function(state = initialState, action: Action): Keymap[] {
    switch (action.type) {
        case KeymapActions.ADD:
        case KeymapActions.DUPLICATE:

            let newKeymap: Keymap = new Keymap(action.payload);

            newKeymap.abbreviation = generateAbbr(state, newKeymap.abbreviation);
            newKeymap.name = generateName(state, newKeymap.name);
            newKeymap.isDefault = false;

            return [...state, newKeymap];

        case KeymapActions.EDIT_NAME:
            let name: string = generateName(state, action.payload.name);

            return state.map((keymap: Keymap) => {
                    if (keymap.abbreviation === action.payload.abbr) {
                        keymap.name = name;
                    }

                    return keymap;
                });

        case KeymapActions.EDIT_ABBR:
            let abbr: string = generateAbbr(state, action.payload.newAbbr);

            return state.map((keymap: Keymap) => {
                    if (keymap.abbreviation === action.payload.abbr) {
                        keymap.abbreviation = abbr;
                    }

                    return keymap;
                });

        case KeymapActions.SET_DEFAULT:
            return state.map((keymap: Keymap) => {
                    keymap.isDefault = (keymap.abbreviation === action.payload);

                    return keymap;
                });

        case KeymapActions.REMOVE:
            let isDefault: boolean;

            let filtered: Keymap[] = state.filter((keymap: Keymap) => {
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

            return filtered;

        case KeymapActions.SAVE_KEY:
            let changedKeymap: Keymap = new Keymap;

            return state.map((keymap: Keymap) => {
                if (keymap.abbreviation === action.payload.abbreviation) {
                    keymap = Object.assign(changedKeymap, action.payload);
                }

                return keymap;
            });

        default: {
            return state;
        }
    }
}

export function getKeymap(abbr: string) {
    if (abbr === undefined) {
        return getDefault();
    }

    return (state$: Observable<AppState>) => state$
        .select(appState => appState.keymaps)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.abbreviation === abbr)
        );
}

export function getDefault() {
    return (state$: Observable<AppState>) => state$
        .select(appState => appState.keymaps)
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
    const oldName: string = name;

    while (keymaps.some((keymap: Keymap) => keymap.name === name)) {
        name = oldName + ` (${suffix})`;
        ++suffix;
    }

    return name;
}
