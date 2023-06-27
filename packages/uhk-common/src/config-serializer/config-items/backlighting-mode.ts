export enum BacklightingMode {
    FunctionalBacklighting,
    PerKeyBacklighting,
    FunctionalBacklightingWithPerKeyValues
}

export const PER_KEY_BACKLIGHTING_MODES = Object.freeze([
    BacklightingMode.PerKeyBacklighting,
    BacklightingMode.FunctionalBacklightingWithPerKeyValues
]);

export function isUserConfigContainsRgbColors(backlightingMode: BacklightingMode): boolean {
    return PER_KEY_BACKLIGHTING_MODES.includes(backlightingMode);
}
