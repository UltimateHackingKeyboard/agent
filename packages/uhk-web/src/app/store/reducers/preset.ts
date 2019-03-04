import { Keymap } from 'uhk-common';

import * as Keymaps from '../actions/keymap';

export const initialState: Keymap[] = [];

export function reducer(state = initialState, action: Keymaps.Actions): Keymap[] {
    switch (action.type) {
        case Keymaps.ActionTypes.LoadKeymapsSuccess: {
            return (action as Keymaps.LoadKeymapSuccessAction).payload;
        }

        default:
            return state;
    }
}
