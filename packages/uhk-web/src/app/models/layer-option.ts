import { SecondaryRoleAction } from 'uhk-common';

export interface LayerOption {
    id: number;
    name: string;
    order: number;
    selected: boolean;
    secondaryRole?: SecondaryRoleAction;
    /**
     * Allowed to set as LayerSwitcher
     */
    allowed: boolean;
}
