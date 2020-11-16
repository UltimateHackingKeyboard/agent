export enum AppTheme {
    System = 'system',
    Light = 'light',
    Dark = 'dark'
}

export type AppThemeSelect = {
    id: AppTheme;
    text: string;
}

export interface ApplicationSettings {
    checkForUpdateOnStartUp: boolean;
    everAttemptedSavingToKeyboard: boolean;
    animationEnabled?: boolean;
    appTheme?: AppTheme;
}
