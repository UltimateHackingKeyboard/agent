import { RgbColorInterface } from './rgb-color-interface.js';

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
    backlightingColorPalette?: Array<RgbColorInterface>
    /**
     * Smart Macro panel width in percent;
     */
    smartMacroPanelWidth?: number;
}
