import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Keymap } from 'uhk-common';

import { MacroMenuItem } from './macro-menu-item';

export interface SideMenu {
    title: string;
    link: string;
    faIcon?: IconDefinition;
}

export interface SideMenuPageState {
    showAddonMenu: boolean;
    runInElectron: boolean;
    updatingFirmware: boolean;
    deviceName: string;
    keymaps: Keymap[];
    macros: MacroMenuItem[];
    restoreUserConfiguration: boolean;
    extraMenu?: SideMenu;
}
