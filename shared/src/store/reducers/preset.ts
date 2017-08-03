import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/keymap';
import { KeymapAction, KeymapActions } from '../actions/keymap';

const initialState: Keymap[] = [];

export default function(state = initialState, action: KeymapAction): Keymap[] {
    switch (action.type) {
        case KeymapActions.LOAD_KEYMAPS_SUCCESS: {
            return action.payload;
        }

        default:
            return state;
    }
}
