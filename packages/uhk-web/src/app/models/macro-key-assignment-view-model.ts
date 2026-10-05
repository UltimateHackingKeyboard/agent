import { LayerName } from 'uhk-common';

export interface MacroKeyAssignmentViewModel {
    keymapAbbreviation: string;
    layerId: LayerName;
    moduleId: number;
    keyId: number;
    label: string;
}
