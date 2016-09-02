import { Action } from '@ngrx/store';
import { Macro } from '../../config-serializer/config-items/Macro';
import { MacroActions } from '../actions';

const initialState: Macro[] = [];

export default function(state = initialState, action: Action): Macro[] {
    switch (action.type) {
        case MacroActions.GET_ALL:
            break;
        default: {
            return state;
        }
    }
}
