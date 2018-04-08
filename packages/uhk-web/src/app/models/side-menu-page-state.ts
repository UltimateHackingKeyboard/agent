import { Keymap, Macro } from 'uhk-common';

export interface SideMenuPageState {
    showAddonMenu: boolean;
    runInElectron: boolean;
    updatingFirmware: boolean;
    deviceName: string;
    keymaps: Keymap[];
    macros: Macro[];
    restoreUserConfiguration: boolean;
}
