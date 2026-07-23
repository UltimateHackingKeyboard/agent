import { Params } from '@angular/router';
import { Keymap, Macro, UhkDeviceProduct } from 'uhk-common';

import { MacroMenuItem } from './macro-menu-item';
import { MacroMenuTreeNode } from './macro-menu-tree-node';
import { DeviceUiStates } from './device-ui-states';

export interface SideMenuPageState {
    advancedSettingsMenuVisible: boolean;
    runInElectron: boolean;
    updatingFirmware: boolean;
    deviceName: string;
    keymaps: Keymap[];
    keymapQueryParams: Params;
    macroTree: MacroMenuTreeNode[];
    macros: MacroMenuItem[];
    maxMacroCountReached: boolean;
    restoreUserConfiguration: boolean;
    deviceUiState?: DeviceUiStates;
    connectedDevice?: UhkDeviceProduct;
    selectedKeymap: Keymap | undefined;
    selectedMacro: Macro | undefined;
}
