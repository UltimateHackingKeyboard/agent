import { KeyAction } from 'uhk-common';

export interface KeyActionRemap {
    remapOnAllKeymap: boolean;
    remapOnAllLayer: boolean;
    action: KeyAction;
}
