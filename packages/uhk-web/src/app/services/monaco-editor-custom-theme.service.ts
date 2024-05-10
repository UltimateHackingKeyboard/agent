import { Injectable } from '@angular/core';
import { MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs/operators';

import { syntaxHighlightProvider } from './monaco-editor-syntaxt-highlight-provider';

export const MONACO_EDITOR_UHK_MACRO_LANGUAGE_ID = 'uhk-macro';

@Injectable({ providedIn: 'root' })
export class MonacoEditorCustomThemeService {
    constructor(private monacoLoaderService: MonacoEditorLoaderService) {
        this.monacoLoaderService.isMonacoLoaded$.pipe(
            filter(isLoaded => isLoaded),
            take(1),
        ).subscribe(() => {
            monaco.editor.defineTheme('uhk-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    'editor.background': '#222222',
                    'editor.foreground': '#bbbbbb'
                }
            });
            monaco.editor.defineTheme('uhk-light', {
                base: 'vs',
                inherit: true,
                rules: [
                    { token: 'comment', foreground: '#777777'},
                    { token: 'number', foreground: '#aa0000'},
                    { token: 'string', foreground: '#55aa55'},
                    { token: 'variable', foreground: '#7777ff'},
                ],
                colors: {}
            });

            monaco.languages.register({ id: MONACO_EDITOR_UHK_MACRO_LANGUAGE_ID });
            monaco.languages.setMonarchTokensProvider(
                MONACO_EDITOR_UHK_MACRO_LANGUAGE_ID,
                syntaxHighlightProvider()
            );
        });
    }
}
