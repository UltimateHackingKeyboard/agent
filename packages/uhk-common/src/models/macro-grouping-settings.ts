export interface MacroGroupingSettings {
    camelCaseSeparation: boolean;
    enabled: boolean;
    maxDepth: number;
    minChildren: number;
}

export const MACRO_GROUPING_MIN_DEPTH = 1;

export const DEFAULT_MACRO_GROUPING_SETTINGS: MacroGroupingSettings = {
    camelCaseSeparation: false,
    enabled: false,
    maxDepth: 1,
    minChildren: 2,
};
