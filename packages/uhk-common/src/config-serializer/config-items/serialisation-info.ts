import { BacklightingMode } from './backlighting-mode.js';

/**
 * It is a proxy interface to prevent circular references
 * when we provide the UserConfiguration to other user config items.
 */
export interface SerialisationInfo {
    userConfigMajorVersion: number;
    backlightingMode: BacklightingMode;
}

export const DEFAULT_SERIALISATION_INFO: SerialisationInfo = {
    userConfigMajorVersion: 6,
    backlightingMode: BacklightingMode.FunctionalBacklighting
};
