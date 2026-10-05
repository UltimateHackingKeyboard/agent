export enum KeyLanguage {
    Us = 'us',
    Uk = 'uk',
    German = 'german',
    Nordic = 'nordic'
}

export const DEFAULT_KEY_LANGUAGE = KeyLanguage.Us;

export const KEY_LANGUAGE_OPTIONS: ReadonlyArray<{ id: KeyLanguage; text: string }> = [
    { id: KeyLanguage.Us, text: 'US' },
    { id: KeyLanguage.Uk, text: 'UK' },
    { id: KeyLanguage.German, text: 'German' },
    { id: KeyLanguage.Nordic, text: 'Nordic' }
];
