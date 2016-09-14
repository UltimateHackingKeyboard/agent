import { Keymap } from '../config-serializer/config-items/Keymap';
import { Macro } from '../config-serializer/config-items/Macro';

// State interface for the application
export interface AppState {
    keymap: Keymap[];
    macro: Macro[];
    preset: Keymap[];
}
