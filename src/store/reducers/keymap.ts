import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { KeymapActions } from '../actions';
import { AppState } from '../index';

const initialState: Keymap[] = [];

export default function(state = initialState, action: Action): Keymap[] {
    switch (action.type) {
        case KeymapActions.ADD:
            let newKeymap: Keymap = Object.assign({}, action.payload);

            newKeymap.abbreviation = generateAbbr(state, newKeymap.abbreviation);
            newKeymap.name = generateName(state, newKeymap.name);

            return [...state, newKeymap];
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
        .select(s => s.keymap)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.abbreviation === abbr)
        );
}

export function getDefault() {
    return (state$: Observable<AppState>) => state$
        .select(s => s.keymap)
        .map((keymaps: Keymap[]) =>
            keymaps.find((keymap: Keymap) => keymap.isDefault)
        );
}

function generateAbbr(state: Keymap[], abbr: string): string {
    let chars: string[] = '23456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let position = 0;
    let count: number;

    count = state.filter((keymap: Keymap) => keymap.abbreviation === abbr).length;

    while (count > 0) {
        abbr = abbr.substring(0, abbr.length - 1) + chars[position];
        position++;

        count = state.filter((keymap: Keymap) => keymap.abbreviation === abbr).length;
    }

    return abbr;
}

function generateName(state: Keymap[], name: string) {
    let count: number;
    let suffix = 2;
    const oldName: string = name;

    count = state.filter((keymap: Keymap) => keymap.name === name).length;

    while (count > 0) {
        name = oldName + ` (${suffix})`;
        count = state.filter((keymap: Keymap) => keymap.name === name).length;
        suffix++;
    }

    return name;
}
