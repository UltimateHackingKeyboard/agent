import { UhkDeviceProduct, UserConfiguration } from 'uhk-common';

export interface UndoUserConfigData {
    path: string;
    config: UserConfiguration;
    uhkDeviceProduct: UhkDeviceProduct;
}
