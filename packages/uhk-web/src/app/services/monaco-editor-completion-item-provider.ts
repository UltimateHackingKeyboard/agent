import { Injectable } from '@angular/core';
import { buildUhkParser, Parser, Suggestion } from 'naive-autocompletion-parser';
import { LogService } from 'uhk-common';

@Injectable({ providedIn: 'root' })
export class MonacoEditorCompletionItemProvider implements monaco.languages.CompletionItemProvider {
    public readonly triggerCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.\\@( \\$'.split('');

    private parser: Parser | undefined;
    private identifierCharPattern = /[a-zA-Z]/;

    constructor(private logService: LogService) {
        this.logService.misc('[MonacoEditorCompletionItemProvider] initialized.');
    }

    setReferenceManual(referenceManual: string): void {
        if (referenceManual) {
            this.logService.misc('[MonacoEditorCompletionItemProvider] reference manual updated.');
            this.parser = buildUhkParser(referenceManual);
        } else {
            this.logService.misc('[MonacoEditorCompletionItemProvider] cleared.');
            this.parser = undefined;
        }
    }

    guessKind(text: string, rule: string): [monaco.languages.CompletionItemKind, string] {
        if (rule.slice(rule.length - 7) == '_ABBREV') {
            // key and scancode abbreviations
            return [monaco.languages.CompletionItemKind.Struct, "5"];
        } else if (rule == 'MODMASK') {
            // modmask
            return [monaco.languages.CompletionItemKind.Interface, "4"];
        } else  if (this.identifierCharPattern.test(text[0])) {
            // identifiers, commands
            return [monaco.languages.CompletionItemKind.Text, "3"];
        } else if (text[0] == '<' && text[text.length-1] == '>') {
            // hints
            return [monaco.languages.CompletionItemKind.Property, "1"];
        } else if (text[1] == '<' && text[text.length-2] == '>') {
            // comment hints
            return [monaco.languages.CompletionItemKind.Property, "1"];
        } else {
            // operators
            return [monaco.languages.CompletionItemKind.Module, "2"];
        }
    }

    provideCompletionItems(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.CompletionContext,
        token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CompletionList> {

        if (!this.parser) {
            return {
                suggestions: []
            };
        }

        const lineNumber = position.lineNumber;
        const column = position.column;

        const lineText = model.getValueInRange({
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: column
        });

        let nelaSuggestions: Suggestion[] = [];
        try {
            nelaSuggestions = this.parser.complete(lineText, "BODY");
        } catch (error) {
            this.logService.error('[MonacoEditorCompletionItemProvider] provideCompletionItems error.', error);
        }

        const monacoSuggestions: monaco.languages.CompletionItem[] = nelaSuggestions.map(it => {
            const kind = this.guessKind(it.suggestion, it.originRule);

            return {
                insertText: it.text(),
                kind: kind[0],
                label: it.text(),
                sortText: kind[1] + it.text(),
                range: {
                    startLineNumber: lineNumber,
                    startColumn: column - it.overlap,
                    endLineNumber: lineNumber,
                    endColumn: column
                },
            };
        });

        return {
            suggestions: monacoSuggestions
        };
    }
}
