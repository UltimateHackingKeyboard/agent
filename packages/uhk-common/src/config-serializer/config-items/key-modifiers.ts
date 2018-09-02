export enum KeyModifierValues {
    leftCtrl   = 1 << 0,
    leftShift  = 1 << 1,
    leftAlt    = 1 << 2,
    leftGui    = 1 << 3,
    rightCtrl  = 1 << 4,
    rightShift = 1 << 5,
    rightAlt   = 1 << 6,
    rightGui   = 1 << 7
}

export enum KeyModifierSymbols {
    charachter,
    icon
}
export interface KeyModifierSymbol {
    type: KeyModifierSymbols;
    value: string;
}
export interface KeyModifier {
    buttonGroupText: string;
    keyText: KeyModifierSymbol;
    value: KeyModifierValues;
    symbol: KeyModifierSymbol;
}

export interface KeyModifiers {
    lefts: KeyModifier[];
    rights: KeyModifier[];
}
