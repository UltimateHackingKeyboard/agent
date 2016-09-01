import keymapReducer from './reducers/keymap';
import macroReducer from './reducers/macro';
import { Keymap } from '../config-serializer/config-items/Keymap';
import { Macro } from '../config-serializer/config-items/Macro';

// State interface for the application
export interface AppState {
    keymap: Keymap[];
    macro: Macro[];
}

// All reducers that are used in application
export const storeConfig = {
    keymap: keymapReducer,
    macro: macroReducer
};
