export enum AppTheme {
    Auto = 'auto',
    Light = 'light',
    Dark = 'dark'
}

export interface ApplicationSettings {
    checkForUpdateOnStartUp: boolean;
    everAttemptedSavingToKeyboard: boolean;
    animationEnabled?: boolean;
    appTheme?: AppTheme;
}
