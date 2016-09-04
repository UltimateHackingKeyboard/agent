import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { KeymapActions } from '../actions';

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
