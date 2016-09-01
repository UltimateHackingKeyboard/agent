import { Action } from '@ngrx/store';
import { Macro } from '../../config-serializer/config-items/Macro';

const initialState: Macro[] = [];

export default function(state = initialState, action: Action): Macro[] {
    switch (action.type) {
        default: {
            return state;
        }
    }
}
