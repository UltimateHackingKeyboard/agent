import { RemapInfo } from './remap-info';

export interface ExchangeKey {
    keyId: number;
    moduleId: number;
    layerId: number;
    keymapAbbr: string;
}

export interface ExchangeKeysActionModel {
    remapInfo: RemapInfo;
    aKey: ExchangeKey | undefined;
    bKey: ExchangeKey | undefined;
}
