import { Keymap } from '../config-serializer/config-items/Keymap';
import { Macro } from '../config-serializer/config-items/Macro';

export interface KeymapState {
    entities: Keymap[];
    newAbbr?: string;
}

export interface MacroState {
    entities: Macro[];
}

// State interface for the application
export interface AppState {
    keymaps: KeymapState;
    macros: MacroState;
    presetKeymaps: Keymap[];
}
