import { Keymap } from '../config-serializer/config-items/Keymap';
import { Macro } from '../config-serializer/config-items/Macro';
import { keymapReducer, macroReducer, presetReducer} from './reducers';

// State interface for the application
export interface AppState {
    keymap: Keymap[];
    macro: Macro[];
    preset: Keymap[];
}

// All reducers that are used in application
export const storeConfig = {
    keymap: keymapReducer,
    macro: macroReducer,
    preset: presetReducer
};
