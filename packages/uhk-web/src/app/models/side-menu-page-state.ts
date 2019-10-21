import { Keymap } from 'uhk-common';
import { MacroMenuItem } from './macro-menu-item';

export interface SideMenuPageState {
    showAddonMenu: boolean;
    runInElectron: boolean;
    updatingFirmware: boolean;
    deviceName: string;
    keymaps: Keymap[];
    macros: MacroMenuItem[];
    restoreUserConfiguration: boolean;
}
