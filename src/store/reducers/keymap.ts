import { Action } from '@ngrx/store';

import { Keymap } from '../../config-serializer/config-items/Keymap';
import { KeymapActions } from '../actions';

const initialState: Keymap[] = [];

export default function(state = initialState, action: Action): Keymap[] {
    switch (action.type) {
        case KeymapActions.GET_ALL:
            break;
        default: {
            return state;
        }
    }
}
