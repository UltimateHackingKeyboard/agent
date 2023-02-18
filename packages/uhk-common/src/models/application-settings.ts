import { RgbColor } from './rgb-color.js';

export enum AppTheme {
    System = 'system',
    Light = 'light',
    Dark = 'dark'
}

export type AppThemeSelect = {
    id: AppTheme;
    text: string;
};

export interface ApplicationSettings {
    checkForUpdateOnStartUp: boolean;
    everAttemptedSavingToKeyboard: boolean;
    animationEnabled?: boolean;
    appTheme?: AppTheme;
    backlightingColorPalette?: Array<RgbColor>
    /**
     * Smart Macro panel width in percent;
     */
    smartMacroPanelWidth?: number;
}
