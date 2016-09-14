import { Keymap } from '../config-serializer/config-items/Keymap';
import { Macro } from '../config-serializer/config-items/Macro';

// State interface for the application
export interface AppState {
    keymaps: Keymap[];
    macros: Macro[];
    presetKeymaps: Keymap[];
}
