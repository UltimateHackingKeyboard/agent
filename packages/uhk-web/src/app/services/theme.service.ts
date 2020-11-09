import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LogService } from 'uhk-common';

enum CSSTheme {
    Light = 'light',
    Dark = 'dark'
}

const THEME_FILES = {
    [CSSTheme.Light]: 'stylesLight.css',
    [CSSTheme.Dark]: 'stylesDark.css'
};

const UHK_THEME_ID = 'uhk-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    constructor(@Inject(DOCUMENT) private document: Document, private logService: LogService) {
        this.attachListener();
        this.setTheme(this.isDarkMode() ? CSSTheme.Dark : CSSTheme.Light);

        this.logService.misc('[ThemeService] init success');
    }

    isDarkMode(): boolean {
        return this.darkModeMediaQuery.matches;
    }

    setTheme(theme: CSSTheme): void {
        const currentStylesheetEl = this.getCurrentStylesheetElement();
        const newStylesheetEl = this.createStylesheetElement(theme);
        if (currentStylesheetEl) {
            // Don't try to change already set theme
            if (currentStylesheetEl.getAttribute('data-theme') === theme) return;

            // Set new theme
            this.document.head.replaceChild(newStylesheetEl, currentStylesheetEl);
        } else {
            // Fallback, insert new theme to end of HEAD element
            this.document.head.append(newStylesheetEl);
        }
    }

    private attachListener(): void {
        this.darkModeMediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
            this.setTheme(event.matches ? CSSTheme.Dark : CSSTheme.Light);
        });
    }

    private getCurrentStylesheetElement(): HTMLLinkElement {
        return this.document.head.querySelector(`link[id="${UHK_THEME_ID}"]`);
    }

    private createStylesheetElement(theme: CSSTheme): HTMLLinkElement {
        const file = THEME_FILES[theme] || THEME_FILES[CSSTheme.Light];
        const el = this.document.createElement('link');
        el.setAttribute('id', UHK_THEME_ID);
        el.setAttribute('data-theme', theme);
        el.setAttribute('rel', 'stylesheet');
        el.setAttribute('type', 'text/css');
        el.setAttribute('href', `${file}`);
        return el;
    }
}
