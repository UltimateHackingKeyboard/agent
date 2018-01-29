import { Keymap } from 'uhk-common';

import { KeymapAction, KeymapActions } from '../actions';

export const initialState: Keymap[] = [];

export function reducer(state = initialState, action: KeymapAction): Keymap[] {
    switch (action.type) {
        case KeymapActions.LOAD_KEYMAPS_SUCCESS: {
            return (action as KeymapActions.LoadKeymapSuccessAction).payload ;
        }

        default:
            return state;
    }
}
