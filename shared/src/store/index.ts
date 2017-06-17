import { Keymap } from '../config-serializer/config-items/Keymap';
import { UserConfiguration } from '../config-serializer/config-items/UserConfiguration';

// State interface for the application
export interface AppState {
    userConfiguration: UserConfiguration;
    presetKeymaps: Keymap[];
}

export const getUserConfiguration = (state: AppState) => state.userConfiguration;
