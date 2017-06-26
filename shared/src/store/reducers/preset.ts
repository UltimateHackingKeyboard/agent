import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/keymap';
import { KeymapActions } from '../actions/keymap';

const initialState: Keymap[] = [];

export default function(state = initialState, action: Action): Keymap[] {
    switch (action.type) {
        case KeymapActions.LOAD_KEYMAPS_SUCCESS: {
            return action.payload;
        }

        default:
            return state;
    }
}
