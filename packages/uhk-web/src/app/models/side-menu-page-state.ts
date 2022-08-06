import { Keymap, UhkDeviceProduct } from 'uhk-common';

import { MacroMenuItem } from './macro-menu-item';
import { DeviceUiStates } from './device-ui-states';

export interface SideMenuPageState {
    showAddonMenu: boolean;
    runInElectron: boolean;
    updatingFirmware: boolean;
    deviceName: string;
    keymaps: Keymap[];
    macros: MacroMenuItem[];
    maxMacroCountReached: boolean;
    restoreUserConfiguration: boolean;
    deviceUiState?: DeviceUiStates;
    connectedDevice?: UhkDeviceProduct;
}
