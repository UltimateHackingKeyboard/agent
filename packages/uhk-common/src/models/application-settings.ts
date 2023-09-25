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
    /**
     * Application main error panel height in percent.
     */
    errorPanelHeight?: number;
    everAttemptedSavingToKeyboard: boolean;
    animationEnabled?: boolean;
    appTheme?: AppTheme;
    backlightingColorPalette?: Array<RgbColorInterface>
    /**
     * If true, the keyboard halves are joined together in the UI independently of the actual keyboard state.
     * If extra module is connected then ignore this setting.
     */
    keyboardHalvesAlwaysJoined?: boolean;
    /**
     * Smart Macro panel width in percent;
     */
    smartMacroPanelWidth?: number;
}
