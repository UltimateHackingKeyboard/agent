import { KeyModifierModel } from '../models/key-modifier-model';

export const mapLeftRigthModifierToKeyActionModifier = (left: KeyModifierModel[], right: KeyModifierModel[]): number => {
    const modifiers = [...left, ...right];
    let result = 0;
    for (const modifier of modifiers) {
        if (modifier.checked) {
            result |= modifier.value;
        }
    }

    return result;
};
