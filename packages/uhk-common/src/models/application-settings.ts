import { KeyLanguage } from './key-language.js';
import { MacroGroupingSettings } from './macro-grouping-settings.js';
import { RgbColorInterface } from './rgb-color-interface.js';

export enum AppTheme {
    System = 'system',
    Light = 'light',
    Dark = 'dark'
}

export interface ApplicationSettings {
    checkForUpdateOnStartUp: boolean;
    /**
     * Application main error panel height in percent.
     */
    errorPanelHeight?: number;
    everAttemptedSavingToKeyboard: boolean;
    animationEnabled?: boolean;
    appTheme?: AppTheme;
    /**
     * Scancode-to-symbol mapping used for keymap labels and scancode dropdowns.
     * Agent-only setting; not part of the UHK user configuration.
     */
    keyLanguage?: KeyLanguage;
    backlightingColorPalette?: Array<RgbColorInterface>
    /**
     * If true, the keyboard halves are joined together in the UI independently of the actual keyboard state.
     * If extra module is connected then ignore this setting.
     */
    keyboardHalvesAlwaysJoined?: boolean;
    /**
     * If true, minimizing the Agent window hides it to the system tray instead of the taskbar.
     */
    minimizeToTray?: boolean;
    /**
     * Smart Macro panel width in percent;
     */
    smartMacroPanelWidth?: number;
    /**
     * If true, the Advanced settings menu is shown on Agent startup.
     */
    alwaysEnableAdvancedMode?: boolean;
    /**
     * Sidebar macro grouping preferences.
     */
    macroGrouping?: Partial<MacroGroupingSettings>;
    /**
     * Absolute path of a configuration file in a folder that is synced between computers
     * (for example Dropbox, Google Drive, or a network share). When set, Agent exports the
     * current configuration there and can offer to apply changes made on the other computer.
     */
    sharedConfigurationFilePath?: string;
    /**
     * If true, Agent watches the shared configuration file and prompts to apply it when it
     * changes on the other computer. Requires sharedConfigurationFilePath to be set.
     */
    detectSharedConfigurationChanges?: boolean;
}
