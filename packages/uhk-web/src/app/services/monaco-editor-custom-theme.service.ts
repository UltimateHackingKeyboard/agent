import { Injectable } from '@angular/core';
import { MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs/operators';

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
        });
    }
}
