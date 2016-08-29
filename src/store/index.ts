import keymapReducer, * as fromKeymap from './reducers/keymap';
import { Keymap } from '../config-serializer/config-items/Keymap';
export * from './storage'

// State interface for the application
export interface AppState {
    keymap: Keymap[];
}

// All reducers that are used in application
export const storeConfig = {
    keymap: keymapReducer
};
